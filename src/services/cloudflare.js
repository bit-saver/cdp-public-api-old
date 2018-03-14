import fs from 'fs';
import tus from 'tus-js-client';
import Request from 'request';

const upload = filePath =>
  new Promise( ( resolve, reject ) => {
    const maxEncodingTracks = 100;
    const file = fs.createReadStream( filePath );
    const sizeStats = fs.statSync( filePath );
    const endpoint = `https://api.cloudflare.com/client/v4/zones/${
      process.env.CF_STREAM_ZONE
    }/media`;
    console.log( 'endpoint', endpoint );
    const headers = {
      'X-Auth-Key': process.env.CF_STREAM_KEY || '',
      'X-Auth-Email': process.env.CF_STREAM_EMAIL || '',
      'Content-Type': 'application/json'
    };
    const uploadObj = new tus.Upload( file, {
      endpoint,
      headers,
      chunkSize: 5242880 * 2, // 10 mb
      retryDelays: [
        0, 1000, 3000, 5000
      ],
      metadata: {
        filename: file.name,
        filetype: file.type
      },
      uploadSize: sizeStats.size,
      onError: ( error ) => {
        console.log( `${error}` );
        reject( new Error( error ) );
      },
      onProgress: ( bytesUploaded, bytesTotal ) => {
        // eslint-disable-next-line no-mixed-operators
        const percentage = ( bytesUploaded / bytesTotal * 100 ).toFixed( 2 );
        console.log( `Uploading to Cloudflare - ${percentage}%` );
      },
      onSuccess: () => {
        const streamUrl = uploadObj.url;
        const ret = { url: '', uid: '' };
        if ( streamUrl ) {
          let tracks = 0;
          const trackEncoding = () => {
            tracks += 1;
            if ( tracks > maxEncodingTracks ) {
              return reject( new Error( 'Encoding track maximum reached.' ) );
            }
            Request.get(
              {
                url: streamUrl,
                headers,
                json: true
              },
              ( error, response, body ) => {
                if ( error ) {
                  reject( error );
                } else if ( !body.success ) {
                  return reject( new Error( body.errors.join( '\n' ) ) );
                } else {
                  const status = body.result.status; // eslint-disable-line prefer-destructuring
                  if ( status.state === 'inprogress' ) {
                    console.log( `Encoding - ${parseFloat( status.pctComplete ).toFixed( 2 )}%` );
                  } else if ( status.state === 'ready' ) {
                    console.log( 'Encoding - result', body );
                    ret.uid = body.result.uid;
                    ret.url = body.result.preview;
                    return resolve( { stream: ret } );
                  } else if ( status.state === 'queued' ) {
                    console.log( 'Encoding - queued' );
                  } else if ( status.state !== 'queued' ) {
                    return reject( new Error( `Error in encoding process: ${status.state}` ) );
                  } else {
                    console.warn( 'Unknown Cloudflare track status:', status );
                  }
                  setTimeout( trackEncoding, 2000 );
                }
              }
            );
          };
          trackEncoding();
        } else if ( !streamUrl ) {
          reject( new Error( 'No media URL returned.' ) );
        }
      }
    } );
    uploadObj.start();
  } );

const cloudflare = {
  upload
};

export default cloudflare;
