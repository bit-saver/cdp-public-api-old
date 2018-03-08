import { Router } from 'express';
import controller from './controller';

const router = new Router();

router.route( '/' ).get( controller.getAllDocuments );
router.route( '/:id' ).get( controller.getDocumentById );

export default router;
