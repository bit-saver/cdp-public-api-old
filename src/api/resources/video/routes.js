import { Router } from 'express';
import client from '../../../services/elasticsearch';
import controllerFactory from './controller';

export const INDEX = 'video.america.gov';
export const TYPE = 'video';

const router = new Router();
const controller = controllerFactory( client, INDEX, TYPE );

// Route: /v1/video
router.route( '/' ).post( controller.indexDocument );

// Route: /v1/video/6eaQ_GABU8PIJVQqPddr
router
  .route( '/:id' )
  .get( controller.getDocument )
  .post( controller.updateDocument )
  .delete( controller.deleteDocument );

export default router;
