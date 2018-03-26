import morgan from 'morgan';
import compression from 'compression';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import cuid from 'cuid';

const addRequestId = ( req, res, next ) => {
  req.requestId = cuid();
  next();
};

const middlewareSetup = ( app ) => {
  app.use( compression() );
  app.use( addRequestId );
  app.use( helmet() );
  app.use( cors() );
  app.use( bodyParser.json() );
  app.use( bodyParser.urlencoded( { extended: true } ) );

  if ( process.env.NODE_ENV !== 'local' ) {
    app.use( morgan( 'dev' ) );
  }
};

export default middlewareSetup;
