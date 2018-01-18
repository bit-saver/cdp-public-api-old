import esParser from './esParser';

// Pull controllers out to properly test
// It will make it easier to integrate a db if we decide to do so
export const controllers = {
  indexDocument( model, docToIndex ) {
    return model.indexDocument( docToIndex ).then( esParser.parseCreateResult( docToIndex ) );
  },

  updateDocument( model, docToUpdate, data ) {
    return model
      .updateDocument( docToUpdate, data )
      .then( esParser.parseUpdateResult( docToUpdate, data ) );
  },

  deleteDocument( model, docToDelete ) {
    return model.deleteDocument( docToDelete ).then( esParser.parseDeleteResult( docToDelete ) );
  },

  getDocument( model, docToGet ) {
    return model.getDocument( docToGet ).then( esParser.parseGetResult( docToGet ) );
  }
};

// POST v1/[resource]
export const indexDocument = model => ( req, res, next ) => {
  controllers
    .indexDocument( model, req.body )
    .then( doc => res.status( 201 ).json( doc ) )
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
    .deleteDocument( model, req.params.id )
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

export const generateControllers = ( model, overrides = {} ) => {
  const defaults = {
    indexDocument: indexDocument( model ),
    updateDocument: updateDocument( model ),
    deleteDocument: deleteDocument( model ),
    getDocument: getDocument( model )
  };

  return { ...defaults, ...overrides };
};
