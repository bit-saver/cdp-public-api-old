import TaxonomyModel from './model';
import * as utils from '../../modules/utils';

// elastic/parser
const parseAllResult = result =>
  new Promise( ( resolve ) => {
    if ( result.hits && result.hits.total > 0 ) {
      const terms = result.hits.hits.reduce( ( acc, val ) => {
        acc.push( val._source );
      } );
      resolve( terms );
    }
    resolve( {} );
  } );

// elastic/controller
const controllers = {
  async getAllDocuments( model ) {
    return model.getAllDocuments();
  }
};

// modules/generateControllers
const getAllDocuments = model => async ( req, res, next ) =>
  controllers
    .getAllDocuments( model )
    .then( ( docs ) => {
      if ( !utils.callback( req, { docs } ) ) res.status( 201 ).json( docs );
    } )
    .catch( err => next( err ) );

// taxonomy/controller
const generateControllers = ( model, overrides = {} ) => {
  const defaults = {
    getAllDocuments: getAllDocuments( model )
  };

  return { ...defaults, ...overrides };
};

export default generateControllers( new TaxonomyModel() );
