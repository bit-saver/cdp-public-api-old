import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();

routes.post('/count', controller.count);

export default routes;
