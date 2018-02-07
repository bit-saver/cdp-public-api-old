/*
  Parser is responsible for formatting the raw ElasticSearch data
  in an easier to manage format
 */

// Need to determin is the result prop should be sent back
export default {
  parseUniqueDocExists() {
    return result =>
      new Promise( ( resolve, reject ) => {
        if ( result.hits ) {
          const { total } = result.hits;
          if ( !total ) {
            return resolve( null );
          }
          if ( total === 1 ) {
            return resolve( result.hits.hits[0]._id );
          }
          reject( new Error( 'Multiple results exist.' ) );
        }
      } );
  },

  parseFindResult() {
    return result =>
      new Promise( ( resolve, reject ) => {
        if ( result.hits && result.hits.total > 0 ) {
          const hits = result.hits.hits.map( hit => ( { id: hit._id, ...hit._source } ) );
          return resolve( hits );
        }
        reject( new Error( 'Not found.' ) );
      } );
  },

  parseGetResult( id ) {
    return result =>
      new Promise( ( resolve, reject ) => {
        if ( result.found ) {
          return resolve( { id: result._id, ...result._source } );
        }
        reject( id );
      } );
  },

  parseCreateResult( doc ) {
    return result => ( { id: result._id, ...doc } );
  },

  parseUpdateResult( id, doc ) {
    return result =>
      new Promise( ( resolve, reject ) => {
        if ( result._id ) {
          return resolve( { id: result._id, ...doc } );
        }
        reject( id );
      } );
  },

  parseDeleteResult( id ) {
    return result =>
      new Promise( ( resolve, reject ) => {
        if ( result.found ) {
          return resolve( id );
        }
        reject( id );
      } );
  }
};
