require('dotenv').config();
import fs from 'fs';
import https from 'https';
const privateKey = fs.readFileSync('../server.key', 'utf8');
const certificate = fs.readFileSync('../server.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

import express from 'express';
import { middlewareSetup } from './middleware';
import {
  searchRoutes,
  getRoutes,
  getSourceRoutes,
} from './modules';

const app = express();
middlewareSetup(app);
app.use('/v1', [searchRoutes, getRoutes, getSourceRoutes]);

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(~~process.env.PORT, () => {
  console.log(`CDP service listening on port: ${process.env.PORT}`);
});
