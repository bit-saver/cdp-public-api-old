/*
  The Data Access Layer (DAL) provides the controllers for making
  requests against the database (currently ElasticSearch).
 */

import controllers from './elastic/controller';
import Request from 'request';

// POST v1/[resource]
export const indexDocument = model => ( req, res, next ) => {
  controllers
    .indexDocument( model, req.body )
    .then( ( doc ) => {
      if ( req.headers.callback ) {
        console.log( 'sending callback', req.headers.callback );
        Request.post(
          {
            url: req.headers.callback,
            json: true,
            form: {
              error: 0,
              doc
            }
          },
          () => {}
        );
      } else res.status( 201 ).json( doc );
    } )
    .catch( error => next( error ) );
};

// POST v1/[resource]/:id
export const updateDocument = model => async ( req, res, next ) => {
  const docToUpdate = req.params.id;
  const data = req.body;

  return controllers
    .updateDocument( model, docToUpdate, data )
    .then( doc => res.status( 201 ).json( doc ) )
    .catch( err => next( err ) );
};

// DELETE v1/[resource]/:id
export const deleteDocument = model => ( req, res, next ) => {
  controllers
    .deleteDocument( model, req.params.uuid )
    .then( doc => res.status( 201 ).json( doc ) )
    .catch( err => next( err ) );
};

// GET v1/[resource]/:id
export const getDocument = model => ( req, res, next ) => {
  controllers
    .getDocument( model, req.params.id )
    .then( doc => res.status( 200 ).json( doc ) )
    .catch( err => next( err ) );
};

export const findDocument = model => docToFind => controllers.findDocument( model, docToFind );

export const generateControllers = ( model, overrides = {} ) => {
  const defaults = {
    indexDocument: indexDocument( model ),
    updateDocument: updateDocument( model ),
    deleteDocument: deleteDocument( model ),
    getDocument: getDocument( model ),
    findDocument: findDocument( model )
  };

  return { ...defaults, ...overrides };
};
