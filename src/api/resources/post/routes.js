import { Router } from 'express';
import controller from './controller';
import PostModel from './model';
import { transferCtrl, deleteCtrl } from '../../../middleware/transfer';
import asyncResponse from '../../../middleware/asyncResponse';
import cleanTempFilesCtrl from '../../../middleware/cleanTempFiles';

const router = new Router();

router.param( 'uuid', controller.setRequestDoc );

// Route: /v1/post
router
  .route( '/' )
  .post( asyncResponse, transferCtrl( PostModel ), cleanTempFilesCtrl, controller.indexDocument );

// Route: /v1/post/[uuid]
router
  .route( '/:uuid' )
  .put( asyncResponse, transferCtrl( PostModel ), cleanTempFilesCtrl, controller.updateDocumentById ) // eslint-disable-line max-len
  .get( controller.getDocumentById )
  .delete( deleteCtrl( PostModel ), controller.deleteDocumentById );

export default router;
