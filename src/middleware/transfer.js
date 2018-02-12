import aws from '../services/amazon-aws';
import Download from '../api/modules/download';
import Request from 'request';

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

const transferAsset = async ( model, asset ) => {
  console.info( 'downloading', asset.downloadUrl );

  // TODO: only download if ext is one we want to process
  const download = await downloadAsset( asset.downloadUrl );
  model.putAsset( { ...asset, md5: download.props.md5 } );

  return new Promise( ( resolve, reject ) => {
    // Attempt to find matching asset in ES document
    const updatedNeeded = model.updateIfNeeded( asset, download.props.md5 );
    if ( !updatedNeeded ) {
      console.log( 'md5 match, update not required' );
      resolve( { message: 'Update not required.' } );
    } else {
      console.log( 'need to update' );
      uploadAsset( model.json.site, model.json.post_id, download )
        .then( ( result ) => {
          updateAsset( model, asset, result, download.props.md5 );
          resolve( result );
        } )
        .catch( err => reject( err ) );
    }
  } );
};

/**
 * Generates a "transfer" middleware that serves as an intermediary
 * between an index/update request and the actual ES action.
 * This step downloads the file and uploads it to S3.
 *
 * @param Model AbstractModel
 */
const generateTransferCtrl = Model => async ( req, res, next ) => {
  let reqAssets = [];
  const transfers = []; // Promise array (holds all download/upload processes)

  const model = new Model();

  try {
    // verify that we on operasting on a single, unique document
    reqAssets = await model.prepareDocumentForUpdate( req.body );
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
      console.log( 'transfer results', results );
      console.log( 'req.body', JSON.stringify( req.body, undefined, 2 ) );
      next();
    } )
    .catch( ( err ) => {
      if ( req.headers.callback ) {
        console.log( 'sending callback error' );
        Request.post(
          {
            url: req.headers.callback,
            json: true,
            body: {
              error: 1,
              message: err,
              request: req.body
            }
          },
          () => {}
        );
      } else res.status( 500 ).json( err );
    } );
};

export default generateTransferCtrl;
