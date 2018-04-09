import TaxonomyModel from '../api/resources/taxonomy/model';
import controllers from '../api/modules/elastic/controller';

/**
 * Adds a categories array property to each locale unit by translating
 * based on the category IDs in the category array on the body root.
 * The function has several layers of promise nesting so that each unit
 * is iterated over and then each category within that unit allowing each
 * to be translated at the same time.
 *
 * @param Model
 * @returns {function(*=, *, *)}
 */
export const translateCategories = Model => async ( req, res, next ) => {
  console.log( 'TRANSLATING CATEGORIES INIT', req.requestId );
  const model = new Model();

  const taxonomy = new TaxonomyModel();

  // Nested 3
  const translateCategory = async ( unit, id ) => {
    const name = await taxonomy.translateTermById( id, unit.language.locale );
    return { id, name };
  };

  // Nested 2
  const translateUnit = unit =>
    new Promise( ( resolve ) => {
      const catPromises = [];
      unit.categories.forEach( ( cat ) => {
        catPromises.push( translateCategory( unit, cat.id ) );
      } );
      Promise.all( catPromises ).then( ( results ) => {
        results.forEach( ( result ) => {
          if ( result.name ) {
            const cat = unit.categories.find( val => val.id === result.id );
            if ( cat ) cat.name = result.name;
          }
        } );
        resolve();
      } );
    } );

  const promises = [];
  const units = await model.prepareCategoriesForUpdate( req );
  // Nested 1 (root)
  units.forEach( ( unit ) => {
    promises.push( translateUnit( unit ) );
  } );
  Promise.all( promises )
    .then( () => {
      next();
    } )
    .catch( ( err ) => {
      console.error( err );
      next( err );
    } );
};

export const keywordCategories = async ( req, res, next ) => {
  const model = new TaxonomyModel();
  const body = req.body; // eslint-disable-line prefer-destructuring
  if ( 'keywords' in body !== true ) return next();
  const keywords = [];
  const terms = body.categories || [];
  body.keywords = body.keywords.map( kw => kw.toLowerCase() );
  await body.keywords.reduce(
    async ( accumP, keyword ) =>
      accumP.then( async () => {
        await controllers
          .findTermByName( model, keyword )
          .then( ( result ) => {
            if ( !result ) {
              console.log( 'no term for', keyword );
              keywords.push( keyword );
            } else if ( !terms.includes( result._id ) ) {
              terms.push( result._id );
            }
          } )
          .catch( () => {
            console.log( 'no term for', keyword );
            keywords.push( keyword );
          } );
        return {};
      } ),
    Promise.resolve( {} )
  );
  body.keywords = keywords;
  body.categories = terms;
  next();
};
