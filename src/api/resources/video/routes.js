import { Router } from 'express';
import client from '../../../services/elasticsearch';
import controllerFactory from './controller';
import transferCtrl from '../../../middleware/transfer';
import Video from './video.model';

export const INDEX = 'videos';
export const TYPE = 'video';

const router = new Router();
const controller = controllerFactory( client, INDEX, TYPE );

// Route: /v1/video
router.route( '/' ).post( transferCtrl( controller, Video ), controller.indexDocument );

// Route: /v1/video/[id]
router
  .route( '/:id' )
  .get( controller.getDocument )
  .post( transferCtrl( controller, Video ), controller.updateDocument )
  .delete( controller.deleteDocument );

export default router;
