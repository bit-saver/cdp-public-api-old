import aws from '../services/amazon-aws';
import Download from '../api/modules/download';
import * as utils from '../api/modules/utils';

const downloadAsset = async ( url ) => {
  const download = await Download( url ).catch( ( err ) => {
    throw err;
  } );
  return download;
};

const uploadAsset = async ( site, postId, download ) => {
  const result = await aws.upload( {
    title: `${site}/video/${postId}/${download.props.md5}`,
    ext: download.props.ext,
    tmpObj: download.tmpObj
  } );

  return result;
};

const updateAsset = ( model, asset, result, md5 ) => {
  // Modify the original request by:
  // replacing the downloadUrl and adding a checksum
  model.putAsset( {
    ...asset,
    downloadUrl: result.Location,
    md5
  } );
};

const deleteAssets = ( assets ) => {
  assets.forEach( ( asset ) => {
    aws.remove( asset );
  } );
};

/**
 * Uses the Content-Type defined in the header of a response
 * from the provided URL. If the Content-Type found in the header
 * is in the list of allowed content types then true is returned.
 *
 * @param url
 * @returns {Promise<boolean>}
 */
const isTypeAllowed = async ( url ) => {
  const allowedTypes = utils.getContentTypes();
  const contentType = await utils.getTypeFromUrl( url );
  if ( !contentType ) return false;
  return allowedTypes.includes( contentType );
};

const transferAsset = async ( model, asset ) => {
  if ( asset.downloadUrl ) {
    let download = null;
    console.info( 'downloading', asset.downloadUrl );

    const allowed = await isTypeAllowed( asset.downloadUrl );
    if ( allowed ) {
      download = await downloadAsset( asset.downloadUrl );
      model.putAsset( { ...asset, md5: download.props.md5 } );
    }

    return new Promise( ( resolve, reject ) => {
      if ( !allowed ) {
        return reject( new Error( `Content type not allowed for asset: ${asset.downloadUrl}` ) );
      }
      // Attempt to find matching asset in ES document
      const updatedNeeded = model.updateIfNeeded( asset, download.props.md5 );
      if ( !updatedNeeded ) {
        console.log( 'md5 match, update not required' );
        resolve( { message: 'Update not required.' } );
      } else {
        console.log( 'need to update' );
        uploadAsset( model.body.site, model.body.post_id, download )
          .then( ( result ) => {
            updateAsset( model, asset, result, download.props.md5 );
            resolve( result );
          } )
          .catch( err => reject( err ) );
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
  Promise.all( transfers )
    .then( ( results ) => {
      const s3FilesToDelete = model.getFilesToRemove();
      if ( s3FilesToDelete.length ) deleteAssets( s3FilesToDelete );
      else console.log( 'no s3 files to delete' );
      console.log( 'transfer results', results );
      console.log( 'req.body', JSON.stringify( req.body, undefined, 2 ) );
      next();
    } )
    .catch( ( err ) => {
      console.log( 'sending transfer error', err );
      if (
        !utils.callback( req, {
          error: 1,
          message: err.message || err,
          request: req.body
        } )
      ) {
        res.status( 400 ).json( err.message || err );
      }
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
