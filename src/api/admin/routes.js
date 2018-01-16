import { Router } from 'express';
import client from '../../services/elasticsearch';
import controllerFactory from './controller';

const router = new Router();
const controller = controllerFactory( client );

// Route: /v1/admin/elastic/indices
router
  .route( '/elastic/indices' )
  .post( controller.indicesCreate )
  .delete( controller.indicesDelete );

router
  .route( '/elastic/indices/mapping' )
  .put( controller.indicesPutMapping )
  .post( controller.indicesGetMapping );

export default router;
