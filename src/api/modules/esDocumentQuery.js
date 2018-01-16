const esQuery = ( client, index, type ) => ( {
  indexDocument( body ) {
    return client.index( { index, type, body } );
  },

  updateDocument( id, body ) {
    return client.index( {
      id,
      index,
      type,
      body
    } );
  },

  getDocument( id ) {
    return client.get( { id, index, type } );
  },

  deleteDocument( id ) {
    return client.delete( { id, index, type } );
  }
} );

export default esQuery;
