import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();
routes.post('/mget', controller.mGet);

export default routes;
