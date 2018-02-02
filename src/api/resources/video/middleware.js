import aws from '../../../services/amazon-aws';
import Download from '../../modules/download';

/**
 * Generates a "transfer" middleware that serves as an intermediary
 * between an index/update request and the actual ES action.
 * This step downloads the file and uploads it to S3.
 * It takes a controller to pass the request onto if all functions
 * succeed.
 *
 * @param controllers
 */
const generateTransferCtrl = controllers => async ( req, res, next ) => {
  let document = await controllers.findDocument( req.body ).catch( () => null );
  const esAssets = [];
  if ( document && document.length > 0 ) {
    [document] = document;
    document.unit.forEach( ( unit, unitIndex ) => {
      unit.source.forEach( ( src, srcIndex ) => {
        esAssets.push( {
          downloadUrl: src.downloadUrl,
          md5: src.md5,
          unitIndex,
          srcIndex
        } );
      } );
    } );
    console.log( 'esAssets', esAssets );

    // Since we found a document, add the ID to the request body
    req.body.id = document.id;
  } else document = null;
  // Promise array (holds all download/upload processes)
  const transfers = [];

  const reqAssets = [];

  /**
   * Downloads the file to a temp file.
   * Does a md5 checksum.
   * Uploads to S3 and resolves on success.
   * Reject on any failure.
   *
   * @param src
   * @param unitIndex
   * @param srcIndex
   * @returns {Promise<any>}
   */
  const getSource = async ( src, unitIndex, srcIndex ) => {
    const download = await Download( src.downloadUrl ).catch( err => err );
    reqAssets.push( download.props.md5 );

    return new Promise( ( resolve, reject ) => {
      console.log( 'download result', download );

      // Attempt to find matching asset in ES document
      const asset = esAssets.find( ass => ass.md5 === download.props.md5 ) !== undefined;
      if ( asset ) {
        console.log( 'md5 match, update not required' );
        // We do not need to reupload
        // but the request still needs to be updated to match the ES doc
        req.body.unit[unitIndex].source[srcIndex].downloadUrl = asset.downloadUrl;
        req.body.unit[unitIndex].source[srcIndex].md5 = asset.md5;
        resolve( { message: 'Update not required.' } );
      } else {
        aws
          .upload( {
            title: `${req.body.site}/video/${req.body.post_id}/${download.props.md5}`,
            ext: download.props.ext,
            tmpObj: download.tmpObj
          } )
          .then( ( result ) => {
            console.log( 'upload result', result );
            // Modify the original request by:
            // replacing the downloadUrl and adding a checksum
            req.body.unit[unitIndex].source[srcIndex].downloadUrl = result.Location;
            req.body.unit[unitIndex].source[srcIndex].md5 = download.props.md5;
            resolve( result );
          } )
          .catch( err => reject( err ) );
      }
    } );
  };

  // Iterate through each unit (language) and source
  // downloading and uploading asynchronously
  req.body.unit.forEach( ( unit, i ) => {
    unit.source.forEach( ( src, j ) => {
      console.info( 'downloading', src.downloadUrl );
      transfers.push( getSource( src, i, j ) );
    } );
  } );

  // Once all promises resolve, pass request onto ES controller
  Promise.all( transfers )
    .then( ( results ) => {
      // Now clean up S3 by removing any unused assets
      esAssets.forEach( ( ass ) => {
        if ( reqAssets.indexOf( ass.md5 ) < 0 ) {
          aws.remove( { url: ass.downloadUrl } );
        }
      } );

      console.log( 'transfer results', results );
      console.log( 'req.body', JSON.stringify( req.body, undefined, 2 ) );
      // res.json( req.body );
      // return ctrl( req, res, next );
      next();
    } )
    .catch( err => res.status( 500 ).json( err ) );
};

export default generateTransferCtrl;
