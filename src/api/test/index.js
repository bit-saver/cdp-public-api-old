import { Router } from 'express';
import Mime from 'mime-types';

const router = new Router();

// List files in cdp-video-tst bucket
router.get( '/', async ( req, res ) => {
  const exts = [
    'png', 'jpg', 'jpeg', 'gif', 'svg', 'mp4', 'mov', 'mp3'
  ];
  const types = [];
  exts.forEach( ( ext ) => {
    types.push( Mime.types[ext] );
  } );
  // const types = Mime.types[''];
  res.json( { types, mimes: Mime.types } );
} );

// Post {url: '', title: ''} to upload the file located at URL to S3
router.post( '/', async ( req, res ) => {} );

export default router;
