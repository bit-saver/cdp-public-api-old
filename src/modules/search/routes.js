import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();
routes.post('/search', controller.search);

export default routes;
