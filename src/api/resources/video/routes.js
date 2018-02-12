import { Router } from 'express';
import client from '../../../services/elasticsearch';
import controllerFactory from './controller';
import { generateDeleteCtrl, generateTransferCtrl } from '../../../middleware/transfer';
import asyncResponse from '../../../middleware/asyncResponse';
import Video from './video.model';

export const INDEX = 'videos';
export const TYPE = 'video';

const router = new Router();
const controller = controllerFactory( client, INDEX, TYPE );

// Route: /v1/video
router
  .route( '/' )
  .post( asyncResponse, generateTransferCtrl( controller, Video ), controller.indexDocument );

// Route: /v1/video/[id]
router
  .route( '/:uuid' )
  .get( controller.getDocument )
  .post( generateTransferCtrl( controller, Video ), controller.updateDocument )
  .delete( generateDeleteCtrl( controller, Video ), controller.deleteDocument );

export default router;
