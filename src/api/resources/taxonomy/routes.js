import { Router } from 'express';
import controller from './controller';

const router = new Router();

router.route( '/' ).get( controller.getAllDocuments );
router.route( '/:id' ).get( controller.getDocumentById );
router.route( '/search/:name' ).get( controller.findTermByName );
router.route( '/:id/locale/:locale' ).get( controller.translateTermById );

export default router;
