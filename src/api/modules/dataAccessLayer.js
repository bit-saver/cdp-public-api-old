/*
  The Data Access Layer (DAL) provides the controllers for making
  requests against the database (currently ElasticSearch).
 */

import controllers from './elastic/controller';

// POST v1/[resource]
export const indexDocument = model => ( req, res, next ) => {
  controllers
    .indexDocument( model, req.body )
    .then( doc => res.status( 201 ).json( doc ) )
    .catch( error => next( error ) );
};

// DELETE v1/[resource]/
export const deleteDocument = model => ( req, res, next ) => {
  controllers
    .deleteDocumentByQuery( model, req.body )
    .then( doc => res.status( 201 ).json( doc ) )
    .catch( err => next( err ) );
};

// GET v1/[resource]/?site-[site]&post_id=[post_id]
export const getDocument = model => ( req, res, next ) => {
  controllers
    .getDocument( model, req.query )
    .then( doc => res.status( 200 ).json( doc ) )
    .catch( err => next( err ) );
};

// PUT v1/[resource]/:id
export const updateDocumentById = model => async ( req, res, next ) => {
  controllers
    .updateDocumentById( model, req.body, req.params.id )
    .then( doc => res.status( 201 ).json( doc ) )
    .catch( err => next( err ) );
};

// DELTE v1/[resource]/:id
export const deleteDocumentById = model => async ( req, res, next ) => {
  controllers
    .deleteDocumentById( model, req.params.id )
    .then( doc => res.status( 201 ).json( doc ) )
    .catch( err => next( err ) );
};

// GET v1/[resource]/:id
export const getDocumentById = model => ( req, res, next ) => {
  controllers
    .getDocumentById( model, req.params.id )
    .then( doc => res.status( 200 ).json( doc ) )
    .catch( err => next( err ) );
};

export const generateControllers = ( model, overrides = {} ) => {
  const defaults = {
    indexDocument: indexDocument( model ),
    updateDocumentById: updateDocumentById( model ),
    deleteDocument: deleteDocument( model ),
    deleteDocumentById: deleteDocumentById( model ),
    getDocument: getDocument( model ),
    getDocumentById: getDocumentById( model )
  };

  return { ...defaults, ...overrides };
};
