import { Router } from 'express';
import apiErrorHandler from './modules/errorHandler';

import adminRoutes from './admin/routes';
import searchRoutes from './search/routes';
import videoRoutes from './resources/video/routes';
import testRoutes from './testing';

const router = new Router();

// admin routes
router.use( '/admin', adminRoutes );

// search -- /v1/search, etc., v1 comes from app.use in index.js
router.use( '/search', searchRoutes );

// resources
router.use( '/video', videoRoutes );

// test
router.use( '/test', testRoutes );

// Catch all errors
router.use( apiErrorHandler );

export default router;
