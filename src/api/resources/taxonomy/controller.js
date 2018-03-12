import TaxonomyModel from './model';
import controllers from '../../modules/elastic/controller';
import { generateControllers } from '../../modules/controllers/generateList';

const taxModel = new TaxonomyModel();

const findTermByName = model => async ( req, res, next ) =>
  controllers
    .findTermByName( model, req.params.name )
    .then( term => res.json( term ) )
    .catch( err => next( err ) );

const translateTermById = model => async ( req, res, next ) =>
  controllers
    .translateTermById( model, req.params.id, req.params.locale )
    .then( ( name ) => {
      res.json( name );
    } )
    .catch( err => next( err ) );

const overrides = {
  findTermByName: findTermByName( taxModel ),
  translateTermById: translateTermById( taxModel )
};

// taxonomy/controller
export default generateControllers( taxModel, overrides );
