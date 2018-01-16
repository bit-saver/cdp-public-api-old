import esQueryFactory from '../modules/esAdminQuery';

const controller = ( client ) => {
  const esQuery = esQueryFactory( client );

  return {
    indicesCreate: ( req, res, next ) =>
      esQuery
        .indicesCreate( req.body.index )
        .then( doc => res.status( 200 ).json( doc ) )
        .catch( err => next( err ) ),

    indicesDelete: ( req, res, next ) =>
      esQuery
        .indicesDelete( req.body.index )
        .then( doc => res.status( 200 ).json( doc ) )
        .catch( err => next( err ) ),

    indicesPutMapping: ( req, res, next ) =>
      esQuery
        .indicesPutMapping( req.body.index, req.body.type, req.body.body )
        .then( doc => res.status( 200 ).json( doc ) )
        .catch( err => next( err ) ),

    indicesGetMapping: ( req, res, next ) =>
      esQuery
        .indicesGetMapping( req.body.index, req.body.type )
        .then( doc => res.status( 200 ).json( doc ) )
        .catch( err => next( err ) )
  };
};

export default controller;
