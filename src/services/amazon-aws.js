import fs from 'fs';
import AWS from 'aws-sdk';

AWS.config.update( {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: process.env.AWS_S3_REGION
} );

const s3 = new AWS.S3();

/**
 * Sanitizes potential file names by removing all non-alphanumeric
 * characters and replacing spaces with dashes.
 *
 * @param str
 * @returns {string}
 */
function sanitizeStr( str ) {
  return str.replace( /[^/0-9a-zA-Z\s]/g, '' ).replace( /\s/g, '-' );
}

/**
 * Checks to see if key exists in bucket. Returns a promise
 * that resolves to true or false.
 *
 * @param bucket
 * @param key
 * @returns {Promise<any>}
 */
const checkExists = ( bucket, key ) =>
  new Promise( ( resolve ) => {
    s3.headObject( { Bucket: 'cdp-video-tst', Key: key }, ( err ) => {
      if ( err && err.code === 'NotFound' ) resolve( false );
      else resolve( true );
    } );
  } );

/**
 * Upload a file (referenced as a tmp object aka temporary file) to Amazon S3.
 * If replace is false: checks for existing files first using title+ext and
 * increments the filename until finding a configuration
 * that does not exist.
 *
 * @param title
 * @param ext
 * @param tmpObj
 * @param bucket
 * @param replace
 * @returns {Promise<any>}
 */
const upload = ( {
  title, ext, tmpObj: tmpObj = null, bucket = 'cdp-video-tst', replace = true
} ) =>
  new Promise( async ( resolve, reject ) => {
    const base = sanitizeStr( title );
    let key = `${base}${ext}`;
    let exists = await checkExists( bucket, key );

    if ( !replace ) {
      let index = 0;
      while ( exists ) {
        index += 1;
        if ( index > 5 ) {
          reject( new Error( `S3 Upload: File already exists (attempted: ${index})` ) );
        }
        key = `${base}-${index}${ext}`;
        exists = await checkExists( bucket, key ); // eslint-disable-line no-await-in-loop
      }
    }

    const body = fs.createReadStream( tmpObj.name );

    const params = {
      Bucket: bucket,
      Key: key,
      Body: body,
      ACL: 'private' // TODO: Switch back to 'public-read' for any kind of non-test based functionality
    };

    const manager = s3.upload( params );
    manager
      .on( 'httpUploadProgress', ( progress ) => {
        // console.log( 'progress', progress );
        // { loaded: 4915, total: 192915, part: 1, key: 'foo.jpg' }
        // eslint-disable-next-line no-mixed-operators
        const percent = ( progress.loaded / progress.total * 100 ).toFixed( 0 );
        console.info( `${key}: ${percent}%` );
      } )
      .promise()
      .then( ( data ) => {
        tmpObj.removeCallback();
        resolve( { filename: key, ...data } );
      } )
      .catch( ( err ) => {
        tmpObj.removeCallback();
        return reject( err );
      } );
  } );

export default {
  s3,
  upload
};
