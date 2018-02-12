import { Router } from 'express';
import controller from './controller';
import VideoModel from './videoModel';
import { transferCtrl, deleteCtrl } from '../../../middleware/transfer';
import asyncResponse from '../../../middleware/asyncResponse';

const router = new Router();

// Route: /v1/video
router
  .route( '/' )
  .post( asyncResponse, transferCtrl( VideoModel ), controller.indexDocument )
  .get( controller.getDocument )
  .delete( deleteCtrl( VideoModel ), controller.deleteDocument );

// Route: /v1/video/[id]
router
  .route( '/:id' )
  .put( controller.updateDocumentById )
  .get( controller.getDocumentById )
  .delete( controller.deleteDocumentById );

export default router;
