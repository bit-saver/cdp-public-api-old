import esParser from './parser';
import * as document from './document';

// Pull controllers out to properly test
// It will make it easier to integrate a db if we decide to do so
export default {
  async indexDocument( model, body ) {
    const doc = await this.findDocument( model, body );
    if ( doc ) {
      return this.updateDocument( model, document.getId( doc ), body );
    }
    return model.indexDocument( body );
  },

  updateDocument( model, id, body ) {
    return model.updateDocument( id, body ).then( esParser.parseUpdateResult( id, body ) );
  },

  deleteDocument( model, id ) {
    return model.deleteDocument( id ).then( esParser.parseDeleteResult( id ) );
  },

  getDocument( model, docToGet ) {
    return model.getDocument( docToGet ).then( esParser.parseGetResult( docToGet ) );
  },

  async findDocument( model, body ) {
    if ( body.id || ( body.site && body.post_id ) ) {
      const doc = await model.findDocumentById( body );
      return document.exists( doc ) ? doc : null;
    }
    throw new Error( 'Body must have either an id prop or both site and post_id props' );
  }
};
