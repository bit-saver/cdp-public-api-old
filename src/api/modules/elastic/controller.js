import parser from './parser';

// Pull controllers out to properly test
// It will make it easier to integrate a db if we decide to do so
export default {
  async indexDocument( model, body ) {
    const id = await this.findDocument( model, body );
    if ( id ) {
      return this.updateDocument( model, body, id );
    }
    return model.indexDocument( body ).then( parser.parseCreateResult( body ) );
  },

  updateDocument( model, body, id ) {
    return model.updateDocument( id, body ).then( parser.parseUpdateResult( id, body ) );
  },

  updateDocumentById( model, body, id ) {
    return this.updateDocument( model, body, id );
  },

  deleteDocument( model, id ) {
    return model.deleteDocument( id ).then( parser.parseDeleteResult( id ) );
  },

  async deleteDocumentByQuery( model, body ) {
    // could use client.deleteByQuery but that would delete all that match the query
    // prefer to have check for unique value before deleting
    const id = await this.findDocument( model, body );
    if ( id ) {
      return this.deleteDocument( model, id );
    }
    throw new Error( 'Not found.' );
  },

  deleteDocumentById( model, id ) {
    return this.deleteDocument( model, id );
  },

  getDocument( model, query ) {
    return model.findDocumentByQuery( query ).then( parser.parseFindResult() );
  },

  getDocumentById( model, id ) {
    return model.findDocumentById( id ).then( parser.parseGetResult() );
  },

  // Note, not using body id prop, if client has access to id prop use /:id route
  async findDocument( model, body ) {
    if ( body.site && body.post_id ) {
      const id = await model.findDocumentByQuery( body ).then( parser.parseUniqueDocExists() );
      return id;
    }
    throw new Error( 'Body must have both site and post_id props' );
  }
};