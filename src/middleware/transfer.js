import aws from '../services/amazon-aws';
import Download from '../api/modules/download';
import parser from '../api/modules/elastic/parser';

const getDocument = async ( model, body ) => {
  const doc = await model.findDocumentByQuery( body ).then( parser.parseUniqueDocExists() );
  return doc;
};

const populateAssets = ( model, body ) => {
  model.setJson( body );
  return model.getAssets();
};

const downloadAsset = async ( url ) => {
  const download = await Download( url ).catch( ( err ) => {
    throw err;
  } );
  return download;
};

const uploadAsset = async () => {
  console.log( 'uploadAsset' );
};

const transferAsset = async ( model, asset ) => {
  console.info( 'downloading', asset.downloadUrl );

  // TODO: only download if ext is one we want to process
  const download = await downloadAsset( asset.downloadUrl );
  model.putAsset( { ...asset, md5: download.props.md5 } );
  // return new Promise( ( resolve, reject ) => {
  //   // Attempt to find matching asset in ES document
  //   const esAsset = esAssets.find( ass => ass.md5 === download.props.md5 );
  //   if ( esAsset ) {
  //     console.log( 'md5 match, update not required' );
  //     // We do not need to reupload
  //     // but the request still needs to be updated to match the ES doc
  //     reqModel.putAsset( {
  //       ...asset,
  //       downloadUrl: esAsset.downloadUrl,
  //       md5: esAsset.md5
  //     } );
  //     resolve( { message: 'Update not required.' } );
  //   } else {
  //     aws
  //       .upload( {
  //         title: `${req.body.site}/video/${req.body.post_id}/${download.props.md5}`,
  //         ext: download.props.ext,
  //         tmpObj: download.tmpObj
  //       } )
  //       .then( ( result ) => {
  //         // Modify the original request by:
  //         // replacing the downloadUrl and adding a checksum
  //         reqModel.putAsset( {
  //           ...asset,
  //           downloadUrl: result.Location,
  //           md5: download.props.md5
  //         } );
  //         resolve( result );
  //       } )
  //       .catch( err => reject( err ) );
  //   }
  // } );
};

/**
 * Generates a "transfer" middleware that serves as an intermediary
 * between an index/update request and the actual ES action.
 * This step downloads the file and uploads it to S3.
 * It takes a controller to pass the request onto if all functions
 * succeed.
 *
 * @param controllers
 * @param Model AbstractModel
 */
const generateTransferCtrl = Model => async ( req, res, next ) => {
  const transfers = []; // Promise array (holds all download/upload processes)

  const esModel = new Model();
  const reqModel = new Model();

  const reqAssets = populateAssets( reqModel, req.body );

  let document;

  // Verify that we have a single unique doc, if more than 1 returns exit with err
  // need 'return' in front of next as next will NOT stop current execution
  try {
    document = await getDocument( esModel, req.body );
    if ( document ) {
      const esAssets = populateAssets( esModel, document._source );
      reqModel.id = document._id;
    }
  } catch ( err ) {
    return next( err );
  }

  reqAssets.forEach( ( asset ) => {
    transfers.push( transferAsset( reqModel, asset ) );
  } );

  next();

  // Once all promises resolve, pass request onto ES controller
  // Promise.all( transfers )
  //   .then( ( results ) => {
  //     // reassign reqAssets to account for changes
  //     reqAssets = reqModel.getAssets();
  //     // Now clean up S3 by removing any unused assets
  //     esAssets.forEach( ( ass ) => {
  //       if ( !reqAssets.find( val => val.md5 === ass.md5 ) ) {
  //         aws.remove( { url: ass.downloadUrl } );
  //       }
  //     } );
  //     req.body = reqModel.getJson();

  //     console.log( 'transfer results', results );
  //     console.log( 'req.body', JSON.stringify( req.body, undefined, 2 ) );
  //     next();
  //   } )
  //   .catch( err => res.status( 500 ).json( err ) );
};

export default generateTransferCtrl;

// console.log( '---- START REQ ASSETS----' );
// console.log( reqAssets );
// console.log( '---- START ES ASSETS----' );
// console.log( esAssets );
// console.log( '---- END ----' );
