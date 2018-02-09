import { Router } from 'express';
import controller from './controller';
import PostModel from './postModel';
import transferCtrl from '../../../middleware/transfer';

const router = new Router();

// Route: /v1/post
router
  .route( '/' )
  .post( controller.indexDocument )
  .get( controller.getDocument )
  .delete( controller.deleteDocument );

// Route: /v1/post/[id]
router
  .route( '/:id' )
  .put( controller.updateDocumentById )
  .get( controller.getDocumentById )
  .delete( controller.deleteDocumentById );

export default router;
