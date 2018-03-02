import LanguageModel from './model';
import * as utils from '../../modules/utils';

// elastic/parser
const parseAllResult = result =>
  new Promise( ( resolve ) => {
    if ( result.hits && result.hits.total > 0 ) {
      const terms = result.hits.hits.reduce( ( acc, val ) => {
        acc.push( { _id: val._id, ...val._source } );
        return acc;
      }, [] );
      resolve( terms );
    }
    resolve( {} );
  } );

// elastic/controller
const controllers = {
  async getAllDocuments( model ) {
    return model.getAllDocuments().then( parseAllResult );
  }
};

// modules/generateControllers
const getAllDocuments = model => async ( req, res, next ) =>
  controllers
    .getAllDocuments( model )
    .then( ( docs ) => {
      if ( !utils.callback( req, docs ) ) res.status( 201 ).json( docs );
    } )
    .catch( err => next( err ) );

// language/controller
const generateControllers = ( model, overrides = {} ) => {
  const defaults = {
    getAllDocuments: getAllDocuments( model )
  };

  return { ...defaults, ...overrides };
};

export default generateControllers( new LanguageModel() );
