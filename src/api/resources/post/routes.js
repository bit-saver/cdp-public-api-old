import { Router } from 'express';
import controller from './controller';
import PostModel from './postModel';
import { transferCtrl, deleteCtrl } from '../../../middleware/transfer';
import asyncResponse from '../../../middleware/asyncResponse';

const router = new Router();

// Route: /v1/post
router
  .route( '/' )
  .post( asyncResponse, transferCtrl( PostModel ), controller.indexDocument )
  .get( controller.getDocument )
  .delete( deleteCtrl( PostModel ), controller.deleteDocument );

// Route: /v1/post/[id]
router
  .route( '/:id' )
  .put( controller.updateDocumentById )
  .get( controller.getDocumentById )
  .delete( controller.deleteDocumentById );

export default router;
