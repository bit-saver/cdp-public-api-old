import { Router } from 'express';
import controller from './controller';
import VideoModel from './model';
import { validate } from '../../../middleware/validateSchema';
import { transferCtrl, deleteCtrl } from '../../../middleware/transfer';
import asyncResponse from '../../../middleware/asyncResponse';

const router = new Router();

router.param( 'uuid', controller.setRequestDoc );

// Route: /v1/video
router
  .route( '/' )
  // eslint-disable-next-line max-len
  .post( asyncResponse, transferCtrl( VideoModel ), controller.indexDocument );

// Route: /v1/video/[uuid]
router
  .route( '/:uuid' )
  // eslint-disable-next-line max-len
  .put( asyncResponse, transferCtrl( VideoModel ), controller.updateDocumentById )
  .get( controller.getDocumentById )
  .delete( deleteCtrl( VideoModel ), controller.deleteDocumentById );

export default router;
