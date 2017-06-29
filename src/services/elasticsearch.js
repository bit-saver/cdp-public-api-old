require('dotenv').config();
import elasticsearch from 'elasticsearch';

const Client = elasticsearch.Client({
  hosts: process.env.AWS_HOST,
  connectionClass: require('http-aws-es'),
  amazonES: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY_ID,
    secretKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// const ClientDevelopment = elasticsearch.Client({
//   hosts: process.env.HOST,
//   connectionClass: 'http',
//   log: ['error']
// });

export default Client;
