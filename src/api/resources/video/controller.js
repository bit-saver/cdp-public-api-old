// import { generateControllers } from '../../modules/query';
// import elasticsearch from 'elasticsearch';
// import video from './model';

// video.client( elasticsearch );

// export default generateControllers( video );

// export default generateControllers();

/* NOTE: Generic controller methods can be overidden:
const getAll = ( req, res, next ) => {
  res.json( { prop: 'example' } );
};
export default generateControllers( video, { getAll } );
*/

import esQueryFactory from '../../modules/esDocumentQuery';

const controller = ( client, index, type ) => {
  const esQuery = esQueryFactory( client, index, type );

  return {
    indexDocument: ( req, res, next ) =>
      esQuery
        .indexDocument( req.body )
        .then( doc => res.status( 201 ).json( doc ) )
        .catch( err => next( err ) ),

    updateDocument: ( req, res, next ) =>
      esQuery
        .updateDocument( req.params.id, req.body )
        .then( doc => res.status( 201 ).json( doc ) )
        .catch( err => next( err ) ),

    deleteDocument: ( req, res, next ) =>
      esQuery
        .deleteDocument( req.params.id )
        .then( doc => res.status( 200 ).json( doc ) )
        .catch( err => next( err ) ),

    getDocument: ( req, res, next ) =>
      esQuery
        .getDocument( req.params.id )
        .then( doc => res.status( 200 ).json( doc ) )
        .catch( err => next( err ) )
  };
};

export default controller;
