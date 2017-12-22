import { Router } from 'express';

import getRoutes from './get/routes';
import getSourceRoutes from './getSource/routes';
import searchRoutes from './search/routes';

const routes = new Router();

// routes.use looks for routes /v1/get, /v1/search, etc., v1 comes from app.use in index.js
routes.use( '/get', getRoutes );
routes.use( '/getSource', getSourceRoutes );
routes.use( '/search', searchRoutes );

export default routes;
