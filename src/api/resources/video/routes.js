import { Router } from 'express';
import controller from './controller';
import transferCtrl from '../../../middleware/transfer';

const router = new Router();

// Route: /v1/video
router.route( '/' ).post( controller.indexDocument );

// Route: /v1/video/[id]
router
  .route( '/:id' )
  .get( controller.getDocument )
  .post( controller.updateDocument )
  .delete( controller.deleteDocument );

export default router;
