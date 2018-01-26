import { Router } from 'express';
import download from '../modules/download';
import aws from '../modules/amazon/aws';

const router = new Router();

// List files in cdp-video-tst bucket
router.get( '/', async ( req, res ) => {
  await aws.s3.listObjects( { Bucket: 'cdp-video-tst' }, ( err, data ) => {
    if ( err ) throw new Error( err.message );
    else res.status( 201 ).json( data );
  } );
} );

// Post {url: '', title: ''} to upload the file located at URL to S3
router.post( '/', async ( req, res ) => {
  const file = await download( req.body.url ).catch( err =>
    res.status( 500 ).send( err.message || err.toString() ) );
  const filename = req.body.title;

  const result = await aws.upload( filename, file.options.ext, file.content ).catch( err => err );
  res.json( result );
} );

export default router;
