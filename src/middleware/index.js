import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cuid from 'cuid';
import fileUpload from 'express-fileupload';

// var compression = require('compression')

const addRequestId = ( req, res, next ) => {
  req.requestId = cuid();
  next();
};

const middlewareSetup = ( app ) => {
  app.use( addRequestId );
  // app.use(compression())
  app.use( helmet() );
  app.use( cors() );
  app.use( fileUpload() );
  app.use( bodyParser.json() );
  app.use( bodyParser.urlencoded( { extended: true } ) );

  if ( process.env.NODE_ENV !== 'local' ) {
    app.use( morgan( 'dev' ) );
  }
};

export default middlewareSetup;
