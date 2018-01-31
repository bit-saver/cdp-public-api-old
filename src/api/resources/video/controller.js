import esQueryFactory from '../../modules/elastic/query';
import aws from '../../../services/amazon-aws';
import Download from '../../modules/download';
import { generateControllers } from '../../modules/dataAccessLayer';

const controller = ( client, index, type ) => {
  const esQuery = esQueryFactory( client, index, type );
  const controllers = generateControllers( esQuery );

  return controllers;
  /*
    NOTE: Generic controller methods can be overidden:
      const getDocument = ( req, res, next ) => {
      res.json( { prop: 'example' } );
    };
    export default generateControllers( esQuery, { getDocument } );
  */
};

export default controller;
