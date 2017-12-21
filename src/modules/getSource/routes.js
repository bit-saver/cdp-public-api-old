import { Router } from 'express';
import * as controller from './controller';

const routes = new Router();
routes.post( '/getsource', controller.getSource );

export default routes;
