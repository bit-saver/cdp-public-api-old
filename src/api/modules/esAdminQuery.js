const esQueryAdmin = client => ( {
  indicesCreate( index ) {
    return client.indices.create( { index } );
  },

  indicesDelete( index ) {
    return client.indices.delete( { index } );
  },

  indexExists( index ) {
    return client.indices.exists( { index } );
  },

  indicesPutMapping( index, type, body ) {
    return client.indices.putMapping( { index, type, body } );
  },

  indicesGetMapping( index, type ) {
    return client.indices.getMapping( { index, type } );
  }
} );

export default esQueryAdmin;
