require( 'dotenv' ).config();

import express from 'express';
import api from './api';
import middlewareSetup from './middleware';

const app = express();

// setup the app middlware
middlewareSetup( app );

// setup the api
app.use( '/v1', api );

export default app;
