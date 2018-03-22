import TaxonomyModel from './model';
import controllers from '../../modules/elastic/controller';
import { generateControllers, getAllDocuments } from '../../modules/controllers/generateList';
import parse from 'csv-parse/lib/sync';
import parser from '../../modules/elastic/parser';

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

/**
 * Allows the bulk import of taxonomy terms.
 * A CSV is required in the post keyed with name 'terms'.
 * A header is assumed.
 * The CSV has 1 term per row. A name in col 1 is primary.
 * A name in col 2 is a child of the last seen primary (parent).
 * Col 3 are synonyms.
 *
 * @param model
 * @returns {function(*=, *=, *=)}
 */
const bulkImport = model => async ( req, res, next ) => {
  if ( !req.files.length < 1 || !req.files.terms ) {
    return res.json( { error: 1, message: 'No CSV file provided.' } );
  }
  let parent = null;

  /**
   * Indexes a taxonomy term.
   * If the term was previously indexed it is represented by existingTerm.
   * If not, we will try to find an existing term in ES.
   * Finally, we will update the existing or create a new term with the
   * provided synonyms and potential [new] parent.
   *
   * @param name
   * @param syns
   * @param isParent
   * @param existingTerm
   * @returns {Promise<*>}
   */
  const createUpdateTerm = async ( name, syns, isParent, existingTerm ) => {
    let term = existingTerm;
    // If no existingTerm provided, search ES
    if ( !term ) term = await controllers.findTermByName( model, name );
    // If still no term, then create one
    if ( !term ) {
      const body = {
        primary: isParent,
        parents: isParent ? [] : [parent._id],
        synonymMapping: syns,
        language: {
          en: name
        }
      };
      term = await model.indexDocument( body ).then( parser.parseCreateResult( body ) );
      return term;
    }
    // We DO have an existing term so let's update the parents and synonyms
    if ( !isParent && !term.parents.includes( parent._id ) ) term.parents.push( parent._id );
    syns.forEach( ( syn ) => {
      if ( !term.synonymMapping.includes( syn ) ) term.synonymMapping.push( syn );
    } );
    term = await controllers.updateDocument( model, term, term._id );
    return term;
  };

  const processRows = async ( rows ) => {
    // In order keep this synchronous, we have to get really tricky
    // with reduce and promises. Essentially, we return a promise on each reduce
    // iteration which we then extract content from using .then
    // The return from the result is a promise containing the accumulated
    // terms array which is accessed thanks to await
    const seen = await rows.reduce(
      async ( termsP, cols ) =>
        termsP.then( async ( terms ) => {
          // Col 1 (Parent), Col 2 (Child), Col 3 (Syns)
          const syns = [];
          if ( cols.length > 2 && cols[2] ) {
            cols[2].split( ' | ' ).forEach( ( syn ) => {
              if ( !syns.includes( syn ) ) syns.push( syn );
            } );
          }
          let existingTerm = null;
          if ( cols[0] ) {
            // This is a primary category
            if ( terms[cols[0].toLowerCase()] ) {
              existingTerm = terms[cols[0].toLowerCase()];
            }
            const term = await createUpdateTerm( cols[0], syns, true, existingTerm );
            parent = term;
            return { ...terms, [cols[0].toLowerCase()]: term };
          } else if ( cols[1] ) {
            // This is a child category
            if ( terms[cols[1].toLowerCase()] ) {
              existingTerm = terms[cols[1].toLowerCase()];
            }
            const term = await createUpdateTerm( cols[1], syns, false, existingTerm );
            const ret = { ...terms };
            ret[cols[1].toLowerCase()] = term;
            return { ...terms, [cols[1].toLowerCase()]: term };
          }
          return { ...terms };
        } ),
      Promise.resolve( {} )
    );
    return seen;
  };

  const csv = req.files.terms.data;

  try {
    const rows = parse( csv, { from: 1 } );
    if ( rows instanceof Array !== true ) {
      return next( new Error( 'Error parsing CSV.' ) );
    }
    await processRows( rows );
  } catch ( err ) {
    return next( err );
  }
  getAllDocuments( model )( req, res, next );
};

const overrides = {
  findTermByName: findTermByName( taxModel ),
  translateTermById: translateTermById( taxModel ),
  bulkImport: bulkImport( taxModel )
};

// taxonomy/controller
export default generateControllers( taxModel, overrides );
