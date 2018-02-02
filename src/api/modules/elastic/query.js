/*
  Query is responsible for initiating the actual query
  sent to ElasticSearch and returning the raw result.
 */

export default ( client, index, type ) => ( {
  async indexDocument( body ) {
    // if the body has an ID, let's make this an update since we
    // found the actual document
    if ( body.id ) {
      console.log( 'found id, UPDATING ELASTICSEARCH' );
      const doc = { ...body };
      delete doc.id;
      return this.updateDocument( body.id, doc );
    }

    console.log( 'INSERTING ELASTICSEARCH' );
    return client.index( { index, type, body } );
  },

  // update method requires doc prop.
  // doc prop contains part of or complete doc to update
  updateDocument( id, doc ) {
    console.log( 'UPDATING ELASTICSEARCH' );
    return client.update( {
      id,
      index,
      type,
      body: { doc }
    } );
  },

  getDocument( id ) {
    return client.get( { id, index, type } );
  },

  deleteDocument( id ) {
    return client.delete( { id, index, type } );
  },

  findDocument( doc ) {
    return client.search( {
      index,
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  type
                }
              },
              {
                match: {
                  site: doc.site
                }
              },
              {
                match: {
                  post_id: doc.post_id
                }
              }
            ]
          }
        }
      }
    } );
  }
} );
