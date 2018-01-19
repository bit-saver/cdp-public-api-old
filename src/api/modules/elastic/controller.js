import esParser from './parser';

// Pull controllers out to properly test
// It will make it easier to integrate a db if we decide to do so
export default {
  indexDocument( model, docToIndex ) {
    return model.indexDocument( docToIndex ).then( esParser.parseCreateResult( docToIndex ) );
  },

  updateDocument( model, docToUpdate, data ) {
    return model
      .updateDocument( docToUpdate, data )
      .then( esParser.parseUpdateResult( docToUpdate, data ) );
  },

  deleteDocument( model, docToDelete ) {
    return model.deleteDocument( docToDelete ).then( esParser.parseDeleteResult( docToDelete ) );
  },

  getDocument( model, docToGet ) {
    return model.getDocument( docToGet ).then( esParser.parseGetResult( docToGet ) );
  }
};
