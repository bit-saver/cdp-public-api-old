import esQueryFactory from '../../modules/elastic/query';
import aws from '../../../services/amazon-aws';
import Download from '../../modules/download';
import { generateControllers } from '../../modules/dataAccessLayer';

const controller = ( client, index, type ) => {
  const esQuery = esQueryFactory( client, index, type );
  const controllers = generateControllers( esQuery );
  /**
   * Generates a "transfer" controller that serves as an intermediary
   * between an index/update request and the actual ES action.
   * This step downloads the file and uploads it to S3.
   * It takes a controller to pass the request onto if all functions
   * succeed.
   *
   * @param ctrl
   * @returns {function(*=, *=, *=)}
   */
  const generateTransferCtrl = ctrl => async ( req, res, next ) => {
    let document = await controllers.findDocument( req.body ).catch( () => null );
    if ( document && document.length > 0 ) [document] = document;
    else document = null;
    // Promise array (holds all download/upload processes)
    const transfers = [];

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
      return new Promise( ( resolve, reject ) => {
        console.log( 'download result', download );
        let md5Match = false;
        // first verify invalid checksums (if valid no need to do transfer)
        if (
          document &&
          document.unit.length > unitIndex &&
          document.unit[unitIndex].source.length > srcIndex
        ) {
          md5Match = document.unit[unitIndex].source[srcIndex].md5 === download.props.md5;
        }
        if ( md5Match ) {
          console.log( 'md5 match, update not required' );
          // We do not need to reupload
          // but the request still needs to be updated to match the ES doc
          req.body.unit[unitIndex].source[srcIndex].downloadUrl =
            document.unit[unitIndex].source[srcIndex].downloadUrl;
          req.body.unit[unitIndex].source[srcIndex].md5 = download.props.md5;
          resolve( { message: 'Update not required.' } );
        } else {
          aws
            .upload( {
              title: `${req.body.site}/video/${req.body.post_id}/u${unitIndex}s${srcIndex}`,
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
        console.log( 'transfer results', results );
        console.log( 'req.body', JSON.stringify( req.body, undefined, 2 ) );
        // res.json( req.body );
        return ctrl( req, res, next );
      } )
      .catch( err => res.status( 500 ).json( err ) );
  };

  controllers.indexDocument = generateTransferCtrl( controllers.indexDocument );
  controllers.updateDocument = generateTransferCtrl( controllers.updateDocument );

  return controllers;
  /*
    NOTE: Generic controller methods can be overidden:
      const getDocument = ( req, res, next ) => {
      res.json( { prop: 'example' } );
    };
    export default generateControllers( esQuery, { getDocument } );
  */
};

export default controller;
