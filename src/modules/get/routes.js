import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();

routes.post('/get', controller.get);

export default routes;
