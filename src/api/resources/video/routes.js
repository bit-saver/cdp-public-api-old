import { Router } from 'express';
import controller from './controller';
import VideoModel from './model';
import { validate } from '../../../middleware/validateSchema';
import { transferCtrl, deleteCtrl } from '../../../middleware/transfer';
import translateCategories from '../../../middleware/translateCategories';
import asyncResponse from '../../../middleware/asyncResponse';
import cleanTempFilesCtrl from '../../../middleware/cleanTempFiles';

const router = new Router();

router.param( 'uuid', controller.setRequestDoc );

// Route: /v1/videotranslateCategories
router
  .route( '/' )
  .post(
    validate( VideoModel ),
    asyncResponse,
    transferCtrl( VideoModel ),
    translateCategories( VideoModel ),
    cleanTempFilesCtrl,
    controller.indexDocument
  );

// Route: /v1/video/[uuid]
router
  .route( '/:uuid' )
  .put(
    validate( VideoModel ),
    asyncResponse,
    transferCtrl( VideoModel ),
    translateCategories( VideoModel ),
    cleanTempFilesCtrl,
    controller.updateDocumentById
  )
  .get( controller.getDocumentById )
  .delete( deleteCtrl( VideoModel ), controller.deleteDocumentById );

export default router;
