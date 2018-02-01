import createApiTest from '~api.test';
import { INDEX, TYPE } from './routes';

const body = {
  title: 'The Walking Dead',
  author: 'Jane Doe'
};

createApiTest( INDEX, TYPE, body );
