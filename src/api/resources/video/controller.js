import { generateControllers } from '../../modules/query';
import esQueryFactory from '../../modules/esDocumentQuery';

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
