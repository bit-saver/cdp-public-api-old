import { Router } from 'express';
import client from '../../../services/elasticsearch';
import controllerFactory from './controller';
import transferCtrl from '../../../middleware/transfer';
import Post from './post.model';

export const INDEX = 'posts';
export const TYPE = 'post';

const router = new Router();
const controller = controllerFactory( client, INDEX, TYPE );

// Route: /v1/post
router.route( '/' ).post( transferCtrl( controller, Post ), controller.indexDocument );

// Route: /v1/post/[id]
router
  .route( '/:id' )
  .get( controller.getDocument )
  .post( transferCtrl( controller, Post ), controller.updateDocument )
  .delete( controller.deleteDocument );

export default router;
