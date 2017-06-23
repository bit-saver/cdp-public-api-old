require('dotenv').config({
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  optionSuccessStatus: 204,
});
import express from 'express';
import { middlewareSetup } from './middleware';
import {
  searchRoutes,
  getRoutes,
  getSourceRoutes,
} from './modules';

const app = express();

middlewareSetup(app);

app.use('/v2', [
  searchRoutes,
  getRoutes,
  getSourceRoutes
]);

app.listen(~~process.env.PORT, () => {
  console.log(`CDP service listening on port: ${process.env.PORT}`);
});
