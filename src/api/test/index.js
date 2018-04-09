import { Router } from 'express';
import TaxonomyModel from '../resources/taxonomy/model';
import controllers from '../modules/elastic/controller';

const router = new Router();

// eslint-disable-next-line no-unused-vars
router.get( '/', async ( req, res ) => {
  controllers
    .findTermByName( new TaxonomyModel(), 'about america' )
    .then( result => res.json( result ) )
    .catch( err => res.json( err ) );
} );

// Post {url: '', title: ''} to upload the file located at URL to S3
// eslint-disable-next-line no-unused-vars
router.post( '/', async ( req, res ) => {} );

export default router;
