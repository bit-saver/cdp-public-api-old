import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();
routes.post('/msearch', controller.mSearch);

export default routes;
