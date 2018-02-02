import esQueryFactory from '../../modules/elastic/query';
import { generateControllers } from '../../modules/dataAccessLayer';

const controller = ( client, index, type ) => {
  const esQuery = esQueryFactory( client, index, type );

  return generateControllers( esQuery );
  /*
    NOTE: Generic controller methods can be overidden:
      const getDocument = ( req, res, next ) => {
      res.json( { prop: 'example' } );
    };
    export default generateControllers( esQuery, { getDocument } );
  */
};

export default controller;
