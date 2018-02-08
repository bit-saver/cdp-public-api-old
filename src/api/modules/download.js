import URL from 'url';
import Mime from 'mime-types';
import Path from 'path';
import Request from 'request';
import fs from 'fs';
import tmp from 'tmp';
import crypto from 'crypto';

const md5hash = path =>
  new Promise( ( resolve, reject ) => {
    const hash = crypto.createHash( 'md5' );
    const rs = fs.createReadStream( path );
    rs.on( 'error', reject );
    rs.on( 'data', chunk => hash.update( chunk ) );
    rs.on( 'end', () => resolve( hash.digest( 'hex' ) ) );
  } );

/**
 * Downloads content for the given URL.  Returns an object containing
 * properties inferred from the URL and the response's Content Type.
 *
 * REMEMBER TO DELETE TEMP FILE! (tmpObj.removeCallback())
 *
 * @param url
 * @returns {Promise<any>}
 */
export default function download( url ) {
  return new Promise( ( resolve, reject ) => {
    const args = URL.parse( url );
    const props = {};

    tmp.setGracefulCleanup();

    const tmpObj = tmp.fileSync( undefined );
    Request.get( {
      url,
      gzip: true
    } )
      .on( 'error', error => reject( error ) )
      .on( 'response', ( response ) => {
        props.basename = args.path.split( '/' ).pop();

        props.contentType = response.headers['content-type'];

        // Getting the extension this way could be erroneous
        props.ext = Path.extname( props.basename );

        // Cross check ext against known extensions for this content type
        // verify returned exts as text/html; charset=UTF-8' (i.e. 403 error)  threw error
        const typeExts = Mime.extensions[props.contentType];
        if ( typeExts ) {
          if ( typeExts.indexOf( props.ext.replace( '.', '' ) ) < 0 ) {
            // extension does not exist so use the default extension
            props.ext = `.${Mime.extension( props.contentType )}`;
          }
        }
      } )
      .on( 'end', () => {
        // Ensure that temporary file gets deleted
        // setTimeout( tmpObj.removeCallback, 10000 );
        md5hash( tmpObj.name )
          .then( ( result ) => {
            props.md5 = result;
            resolve( { props, tmpObj } );
          } )
          .catch( err => reject( err ) );
      } )
      .pipe( fs.createWriteStream( tmpObj.name ) );
  } );
}
