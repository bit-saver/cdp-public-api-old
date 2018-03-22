import aws from '../services/amazon-aws';
import cloudflare from '../services/cloudflare';
import Download from '../api/modules/download';
import * as utils from '../api/modules/utils';
import { exec as mediainfo } from 'mediainfo-parser';

const downloadAsset = async ( url, requestId ) => {
  const download = await Download( url, requestId ).catch( ( err ) => {
    throw err;
  } );
  return download;
};

const uploadAsset = async ( reqBody, download ) => {
  const result = await aws.upload( {
    title: `${reqBody.site}/${reqBody.type}/${reqBody.post_id}/${download.props.md5}`,
    ext: download.props.ext,
    filePath: download.filePath
  } );

  return result;
};

const uploadStream = async ( download ) => {
  const result = await cloudflare.upload( download.filePath );
  return result;
};

const getSize = download =>
  new Promise( ( resolve, reject ) => {
    mediainfo( download.filePath, ( err, result ) => {
      if ( err ) {
        console.error( 'MEDIAINFO ENCOUNTERED AN ERROR', '\r\n', err );
        return resolve( null );
      }
      if ( result.media.track.length < 1 ) return reject( new Error( 'No media info.' ) );
      const size = {
        width: null,
        height: null,
        filesize: null,
        bitrate: null
      };
      result.media.track.forEach( ( data ) => {
        if ( data._type === 'General' ) {
          size.filesize = data.filesize;
          size.bitrate = data.overallbitrate;
        } else if ( data._type === 'Video' ) {
          size.width = data.width;
          size.height = data.height;
        }
      } );
      console.log( 'mediainfo', JSON.stringify( size, null, 2 ) );
      resolve( { size } );
    } );
  } );

const updateAsset = ( model, asset, result, md5 ) => {
  // Modify the original request by:
  // replacing the downloadUrl and adding a checksum
  model.putAsset( {
    ...asset,
    downloadUrl: result.Location || '',
    stream: result.stream || null,
    size: result.size || null,
    md5
  } );
};

const deleteAssets = ( assets ) => {
  assets.forEach( ( asset ) => {
    aws.remove( asset );
  } );
};

/** //Test
 * Uses the Content-Type defined in the header of a response
 * from the provided URL. If the Content-Type found in the header
 * is in the list of allowed content types then true is returned.
 *
 * @param url
 * @returns {Promise<boolean>}
 */
const isTypeAllowed = async ( url ) => {
  const contentType = await utils.getTypeFromUrl( url );
  if ( !contentType ) return false;
  const allowedTypes = utils.getContentTypes();
  return allowedTypes.includes( contentType );
};

const transferAsset = ( model, asset ) => {
  if ( asset.downloadUrl ) {
    return new Promise( async ( resolve, reject ) => {
      let download = null;
      let updateNeeded = false;
      console.info( 'downloading', asset.downloadUrl );

      const allowed = await isTypeAllowed( asset.downloadUrl );
      if ( allowed && asset.md5 ) {
        // Since we have an md5 in the request, check to see if is already present
        // in the ES model assets and if so, no update needed.
        updateNeeded = model.updateIfNeeded( asset, asset.md5 );
        if ( !updateNeeded ) return resolve( { message: 'Update not required (md5 pre match).' } );
      }
      if ( allowed ) {
        download = await downloadAsset( asset.downloadUrl, model.getRequestId() );
        model.putAsset( { ...asset, md5: download.props.md5 } );
      } else return reject( new Error( `Content type not allowed for asset: ${asset.downloadUrl}` ) );

      // Attempt to find matching asset in ES document
      if ( !updateNeeded ) updateNeeded = model.updateIfNeeded( asset, download.props.md5 );
      if ( !updateNeeded ) {
        console.log( 'md5 match, update not required' );
        resolve( { message: 'Update not required.' } );
      } else {
        console.log( 'need to update' );
        const uploads = [];
        uploads.push( uploadAsset( model.body, download ) );
        if ( download.props.contentType.startsWith( 'video' ) ) {
          uploads.push( uploadStream( download ) );
          uploads.push( getSize( download ) );
        }

        Promise.all( uploads )
          .then( ( results ) => {
            let result = {};
            results.forEach( ( data ) => {
              if ( data ) result = { ...result, ...data };
            } );
            updateAsset( model, asset, result, download.props.md5 );
            resolve( result );
          } )
          .catch( ( err ) => {
            console.error( err );
            return reject( err );
          } );
      }
    } );
  }
};

/**
 * Generates a "transfer" middleware that serves as an intermediary
 * between an index/update request and the actual ES action.
 * This step downloads the file and uploads it to S3.
 *
 * @param Model AbstractModel
 */
export const transferCtrl = Model => async ( req, res, next ) => {
  console.log( 'TRANSFER CONTROLLER INIT', req.requestId );
  let reqAssets = [];
  const transfers = []; // Promise array (holds all download/upload processes)

  const model = new Model();

  try {
    // verify that we are operating on a single, unique document
    reqAssets = await model.prepareDocumentForUpdate( req );
  } catch ( err ) {
    // need 'return' in front of next as next will NOT stop current execution
    return next( err );
  }

  reqAssets.forEach( ( asset ) => {
    transfers.push( transferAsset( model, asset ) );
  } );

  // Once all promises resolve, pass request onto ES controller
  await Promise.all( transfers )
    .then( () => {
      const s3FilesToDelete = model.getFilesToRemove();
      if ( s3FilesToDelete.length ) deleteAssets( s3FilesToDelete );
      console.log( 'TRANSFER CTRL NEXT', req.requestId );
      next();
    } )
    .catch( ( err ) => {
      console.log( 'caught transfer error', err );
      next( err );
    } );
};

export const deleteCtrl = Model => async ( req, res, next ) => {
  const model = new Model();
  let esAssets = [];

  try {
    // verify that we are operating on a single, unique document
    esAssets = await model.prepareDocumentForDelete( req );
  } catch ( err ) {
    // need 'return' in front of next as next will NOT stop current execution
    return next( err );
  }

  const urlsToRemove = esAssets
    .filter( asset => asset.downloadUrl )
    .map( asset => ( { url: asset.downloadUrl } ) );

  deleteAssets( urlsToRemove );
  next();
};
