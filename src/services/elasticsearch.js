require('dotenv').config();
import elasticsearch from 'elasticsearch';

let hosts;
if (process.env.NODE_ENV === 'local') {
  hosts =
    'https://search-amgov-a37eqx5jbjr36wwcx7lkevophq.us-east-1.es.amazonaws.com';
}

const Client = elasticsearch.Client({
  hosts,
  connectionClass: require('http-aws-es'),
  amazonES: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const ClientDevelopment = elasticsearch.Client({
  hosts: process.env.HOST,
  connectionClass: 'http',
  log: ['error']
});

export default Client;
