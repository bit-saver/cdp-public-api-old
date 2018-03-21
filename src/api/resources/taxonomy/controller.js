import TaxonomyModel from './model';
import controllers from '../../modules/elastic/controller';
import { generateControllers, getAllDocuments } from '../../modules/controllers/generateList';
import parse from 'csv-parse/lib/sync';
import parser from '../../modules/elastic/parser';

const jsonl = ( json ) => {
  console.log( JSON.stringify( json, null, 2 ) );
};

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

const bulkImport = model => async ( req, res, next ) => {
  if ( !req.files.length < 1 || !req.files.terms ) {
    return res.json( { error: 1, message: 'No CSV file provided.' } );
  }
  let parent = null;

  const createUpdateTerm = async ( name, syns, isParent = true ) => {
    let term = await controllers.findTermByName( model, name );
    if ( !term ) {
      console.log( 'term not found' );
      const body = {
        primary: isParent,
        parents: isParent ? [] : [parent.id],
        synonymMapping: syns,
        language: {
          en: name
        }
      };
      term = await model.indexDocument( body ).then( parser.parseCreateResult( body ) );
      return term;
    }
    console.log( 'found term', term );
    if ( !isParent && !term.parents.includes( parent.id ) ) term.parents.push( parent.id );
    syns.forEach( ( syn ) => {
      if ( !term.synonymMapping.includes( syn ) ) term.synonymMapping.push( syn );
    } );
    term = await controllers.updateDocument( model, term, term.id );
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
          console.log( 'inside loop' );
          const syns = [];
          if ( cols.length > 2 && cols[2] ) {
            cols[2].split( ' | ' ).forEach( ( syn ) => {
              if ( !syns.includes( syn ) ) syns.push( syn );
            } );
          }
          if ( cols[0] ) {
            const term = await createUpdateTerm( cols[0], syns, true );
            const ret = { ...terms };
            ret[cols[0].toLowerCase()] = term;
            parent = term;
            return ret;
          } else if ( cols[1] ) {
            const term = await createUpdateTerm( cols[1], syns, false );
            const ret = { ...terms };
            ret[cols[1].toLowerCase()] = term;
            return ret;
          }
          return { ...terms };
        } ),
      Promise.resolve( {} )
    );
    console.log( 'loop done' );
    return seen;
  };

  const csv = req.files.terms.data;

  const rows = parse( csv, { from: 1 } );
  if ( rows instanceof Array !== true ) {
    return next( new Error( 'Error parsing CSV.' ) );
  }
  try {
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
