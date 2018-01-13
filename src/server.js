import express from 'express';
import middlewareSetup from './middleware';
import routes from './api';

// Declare an app from express
const app = express();

// setup the app middlware
middlewareSetup( app );

app.use( '/v1', routes );

// catch all
app.all( '*', ( req, res ) => {
  res.json( { ok: true } );
} );

export default app;
