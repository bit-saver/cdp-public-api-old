import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();

routes.post('/exists', controller.exists);

export default routes;
