import fs from 'fs';
import tus from 'tus-js-client';

const upload = filePath =>
  new Promise( ( resolve, reject ) => {
    const file = fs.createReadStream( filePath );
    const sizeStats = fs.statSync( filePath );
    const endpoint = `https://api.cloudflare.com/client/v4/zones/${
      process.env.CF_STREAM_ZONE
    }/media`;
    console.log( 'endpoint', endpoint );
    const uploadObj = new tus.Upload( file, {
      endpoint,
      headers: {
        'X-Auth-Key': process.env.CF_STREAM_KEY || 'key',
        'X-Auth-Email': process.env.CF_STREAM_EMAIL || 'test@america.gov',
        'Content-Type': 'application/json'
      },
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
        console.log( bytesUploaded, bytesTotal, `${percentage}%` );
      },
      onSuccess: () => {
        const streamUrl = uploadObj.url;
        const ret = { streamUrl };
        if ( streamUrl && /\/media\/[0-9a-zA-Z]+$/.test( streamUrl ) ) {
          const args = streamUrl.split( '/' );
          ret.videoId = args[args.length - 1];
        }
        resolve( ret );
      }
    } );
    uploadObj.start();
  } );

const cloudflare = {
  upload
};

export default cloudflare;
