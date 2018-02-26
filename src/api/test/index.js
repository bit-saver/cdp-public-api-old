import { Router } from 'express';

const router = new Router();

router.get( '/', async ( req, res ) => {} );

// Post {url: '', title: ''} to upload the file located at URL to S3
router.post( '/', async ( req, res ) => {} );

export default router;
