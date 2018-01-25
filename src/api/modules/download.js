import http from 'http';
import https from 'https';
import URL from 'url';
import Mime from 'mime-types';
import Path from 'path';

/**
 * Downloads content for the given URL.  Returns an object containing
 * properties inferred from the URL and the response's Content Type.
 *
 * @param url
 * @returns {Promise<any>}
 */
export default function download( url ) {
  return new Promise( ( resolve, reject ) => {
    const options = URL.parse( url );

    const handleRequest = ( res ) => {
      let data = '';
      res.on( 'data', ( chunk ) => {
        data += chunk;
      } );

      res.on( 'end', () => {
        options.filename = options.path.split( '/' ).pop();

        options.contentType = res.headers['content-type'];
        // Getting the extension this way could be erroneous
        options.ext = Path.extname( options.filename );
        // Cross check ext against known extensions for this content type
        if ( Mime.extensions[options.contentType].indexOf( options.ext.replace( '.', '' ) ) < 0 ) {
          // extension does not exist so use the default extension
          options.ext = `.${Mime.extension( options.contentType )}`;
        }

        resolve( { options, content: data } );
      } );
    };

    let request;
    if ( options.protocol === 'https:' ) request = https.request( options, handleRequest );
    else request = http.request( options, handleRequest );

    request.on( 'error', ( e ) => {
      reject( e );
    } );

    request.end();
  } );
}
