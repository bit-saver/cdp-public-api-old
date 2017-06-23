import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';

export const middlewareSetup = app => {
  app.use(helmet());
  app.use(cors({
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    optionSuccessStatus: 204,
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
  }
};
