import { Router } from 'express';
import apiErrorHandler from './modules/errorHandler';

import adminRoutes from './admin/routes';
import getRoutes from './get/routes';
import getSourceRoutes from './getSource/routes';
import searchRoutes from './search/routes';
import videoRoutes from './resources/video/routes';

const router = new Router();

// admin routes
router.use( '/admin', adminRoutes );

// routes.use looks for routes /v1/get, /v1/search, etc., v1 comes from app.use in index.js
router.use( '/get', getRoutes );
router.use( '/getSource', getSourceRoutes );
router.use( '/search', searchRoutes );

router.use( '/video', videoRoutes );

// Catch all errors
router.use( apiErrorHandler );

export default router;
