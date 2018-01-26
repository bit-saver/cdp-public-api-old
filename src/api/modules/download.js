import URL from 'url';
import Mime from 'mime-types';
import Path from 'path';
import Request from 'request';
import md5 from 'md5';

/**
 * Downloads content for the given URL.  Returns an object containing
 * properties inferred from the URL and the response's Content Type.
 *
 * @param url
 * @returns {Promise<any>}
 */
export default function download( url ) {
  return new Promise( ( resolve, reject ) => {
    const args = URL.parse( url );
    const props = {};

    Request.get(
      {
        url,
        resolveWithFullResponse: true,
        encoding: null
      },
      ( error, res, body ) => {
        if ( error ) {
          reject( error );
          return;
        }
        props.filename = args.path.split( '/' ).pop();

        props.contentType = res.headers['content-type'];
        // Getting the extension this way could be erroneous
        props.ext = Path.extname( props.filename );
        // Cross check ext against known extensions for this content type
        if ( Mime.extensions[props.contentType].indexOf( props.ext.replace( '.', '' ) ) < 0 ) {
          // extension does not exist so use the default extension
          props.ext = `.${Mime.extension( props.contentType )}`;
        }
        props.checksum = md5( body );

        resolve( { props, content: body } );
      }
    );
  } );
}
