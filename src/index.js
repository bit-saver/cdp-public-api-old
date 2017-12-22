require( 'dotenv' ).config();

import express from 'express';
import api from './api';
import middlewareSetup from './middleware';

const app = express();

// setup the app middlware
middlewareSetup( app );

// setup the api
app.use( '/v1', api );

const PORT = process.env.PORT || 8080;

app.listen( PORT, () => {
  console.log( `CDP service listening on port: ${process.env.PORT}` );
} );
