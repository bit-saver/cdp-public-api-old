import TaxonomyModel from './model';
import * as utils from '../../modules/utils';
import parser from '../../modules/elastic/parser';

// elastic/controller
const controllers = {
  async getAllDocuments( model ) {
    return model.getAllDocuments().then( parser.parseAllResult );
  },

  async getDocumentById( model, id ) {
    return model.findDocumentById( id ).then( parser.parseGetResult( id ) );
  },

  async findTermByName( model, name ) {
    return model.findTermByName( name ).then( parser.parseUniqueDocExists() );
  }
};

// modules/generateControllers
const getAllDocuments = model => async ( req, res, next ) =>
  controllers
    .getAllDocuments( model )
    .then( ( docs ) => {
      let ret = docs;
      if ( 'tree' in req.query ) ret = TaxonomyModel.constructTree( docs );
      if ( !utils.callback( req, ret ) ) res.status( 201 ).json( ret );
    } )
    .catch( err => next( err ) );

const getDocumentById = model => async ( req, res, next ) => {
  if ( 'tree' in req.query ) {
    return controllers
      .getAllDocuments( model )
      .then( ( docs ) => {
        const tree = TaxonomyModel.constructTree( docs, req.params.id );
        if ( !utils.callback( req, tree ) ) res.status( 201 ).json( tree );
      } )
      .catch( err => next( err ) );
  }
  return controllers
    .getDocumentById( model, req.params.id )
    .then( ( doc ) => {
      if ( !utils.callback( req, doc ) ) res.status( 201 ).json( doc );
    } )
    .catch( err => next( err ) );
};

const findTermByName = model => async ( req, res, next ) =>
  controllers
    .findTermByName( model, req.params.name )
    .then( term => res.json( term ) )
    .catch( err => next( err ) );

const generateControllers = ( model, overrides = {} ) => {
  const defaults = {
    getAllDocuments: getAllDocuments( model ),
    getDocumentById: getDocumentById( model ),
    findTermByName: findTermByName( model )
  };

  return { ...defaults, ...overrides };
};

// taxonomy/controller
export default generateControllers( new TaxonomyModel() );
