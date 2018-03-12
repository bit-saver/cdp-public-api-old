import LanguageModel from './model';
import * as utils from '../../modules/utils';
import parser from '../../modules/elastic/parser';

// elastic/controller
const controllers = {
  async getAllDocuments( model ) {
    return model.getAllDocuments().then( parser.parseAllResult );
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
