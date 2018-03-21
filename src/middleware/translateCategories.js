import TaxonomyModel from '../api/resources/taxonomy/model';

const translateCategories = Model => async ( req, res, next ) => {
  console.log( 'TRANSLATING CATEGORIES INIT', req.requestId );
  const model = new Model();

  const taxonomy = new TaxonomyModel();

  const translateCategory = async ( unit, id ) => {
    const name = await taxonomy.translateTermById( id, unit.locale );
    return { id, name };
  };

  const translateUnit = unit =>
    new Promise( ( resolve ) => {
      const catPromises = [];
      req.body.categories.forEach( ( id ) => {
        catPromises.push( translateCategory( unit, id ) );
      } );
      Promise.all( catPromises ).then( ( results ) => {
        results.forEach( ( result ) => {
          if ( result.name ) unit.categories.push( result );
        } );
        model.putUnit( unit );
        resolve();
      } );
    } );

  const promises = [];
  const units = await model.prepareCategoriesForUpdate( req );
  units.forEach( ( unit ) => {
    promises.push( translateUnit( unit ) );
  } );
  Promise.all( promises )
    .then( () => {
      model.deleteRootCategories();
      next();
    } )
    .catch( ( err ) => {
      console.error( err );
      next( err );
    } );
};

export default translateCategories;
