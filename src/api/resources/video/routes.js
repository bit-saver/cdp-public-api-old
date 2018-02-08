import { Router } from 'express';
import controller from './controller';
import VideoModel from './video.model';
import transferCtrl from '../../../middleware/transfer';

const router = new Router();

// Route: /v1/video
router
  .route( '/' )
  .post( transferCtrl( VideoModel ), controller.indexDocument )
  .get( controller.getDocument )
  .delete( controller.deleteDocument );

// Route: /v1/video/[id]
router
  .route( '/:id' )
  .put( controller.updateDocumentById )
  .get( controller.getDocumentById )
  .delete( controller.deleteDocumentById );

export default router;
