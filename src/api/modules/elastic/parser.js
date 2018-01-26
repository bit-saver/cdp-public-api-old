/*
  Parser is responsible for formatting the raw ElasticSearch data
  in an easier to manage format
 */

// Need to determin is the result prop should be sent back
export default {
  // parseSearchResult( result ) {
  //   return res.hits.hits.map( hit => merge( hit._source, { id: hit._id } ) );
  //   return map( res.hits.hits, hit => merge( hit._source, { id: hit._id } ) );
  // },

  parseCreateResult( doc ) {
    return result => ( { id: result._id, ...doc } );
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
