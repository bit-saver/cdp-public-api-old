import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();

// routes.post( '/', controller.video );

routes
  .route( '/' )
  .get( controller.get )
  .post( controller.post );

routes
  .route( '/' )
  .get( controller.get )
  .post( controller.post );

export default routes;
