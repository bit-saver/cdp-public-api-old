import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();

routes.post( '/', controller.get );

// router.route('/')
//   .get(controller.get)
//   .post(controller.post)

export default routes;
