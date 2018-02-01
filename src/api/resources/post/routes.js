import { Router } from 'express';
import client from '../../../services/elasticsearch';
import controllerFactory from './controller';

export const INDEX = 'post.america.gov';
export const TYPE = 'post';

const router = new Router();
const controller = controllerFactory( client, INDEX, TYPE );

// Route: /v1/post
router.route( '/' ).post( controller.indexDocument );

// Route: /v1/post/[id]
router
  .route( '/:id' )
  .get( controller.getDocument )
  .post( controller.updateDocument )
  .delete( controller.deleteDocument );

export default router;
