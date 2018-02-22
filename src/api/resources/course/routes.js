import { Router } from 'express';
import controller from './controller';
import CourseModel from './courseModel';
import { transferCtrl, deleteCtrl } from '../../../middleware/transfer';
import asyncResponse from '../../../middleware/asyncResponse';

const router = new Router();

router.param( 'uuid', controller.setRequestDoc );

// Route: /v1/course
router.route( '/' ).post( asyncResponse, transferCtrl( CourseModel ), controller.indexDocument );

// Route: /v1/course/[uuid]
router
  .route( '/:uuid' )
  .put( asyncResponse, transferCtrl( CourseModel ), controller.updateDocumentById )
  .get( controller.getDocumentById )
  .delete( deleteCtrl( CourseModel ), controller.deleteDocumentById );

export default router;
