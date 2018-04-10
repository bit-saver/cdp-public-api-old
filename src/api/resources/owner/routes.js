import { Router } from 'express';
import controller from './controller';

const router = new Router();

router
  .route( '/' )
  .get( controller.getAllDocuments )
  .post( controller.indexDocument );

router.route( '/bulk' ).post( controller.bulkImport );

export default router;
