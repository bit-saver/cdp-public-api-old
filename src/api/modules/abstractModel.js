import client from '../../services/elasticsearch';
import parser from '../modules/elastic/parser';

/**
 * Content Model abstraction ensures that the required methods
 * are implemented.
 */
class AbstractModel {
  constructor( index, type ) {
    this.index = index;
    this.type = type;
    this.client = client;
  }

  // TODO: add correct signature, i.e. json param
  // need to disable eslint rule for this method
  // eslint-disable-next-line class-methods-use-this
  getAssets() {
    throw new Error( 'Method not implemented: getAssets' );
  }

  // TODO: add correct signature, i.e. asset param
  // need to disable eslint rule for this method
  // eslint-disable-next-line class-methods-use-this
  putAsset() {
    throw new Error( 'Method not implemented: putAsset' );
  }

  // TODO: add correct signature, i.e. asset param
  // need to disable eslint rule for this method
  // eslint-disable-next-line class-methods-use-this
  getUnits() {
    throw new Error( 'Method not implemented: getUnits' );
  }

  // TODO: add correct signature, i.e. asset param
  // need to disable eslint rule for this method
  // eslint-disable-next-line class-methods-use-this
  putUnit() {
    throw new Error( 'Method not implemented: putUnit' );
  }

  /**
   * Set instance body parameter with argument json.
   * Mainly needed for testing.
   *
   * @param json
   */
  setBody( json ) {
    this.body = json;
  }

  async prepareDocumentForUpdate( req ) {
    if ( req.esDoc ) {
      this.esAssets = this.getAssets( req.esDoc );
    } else {
      const docFromES = await this.findDocumentByQuery( req.body ).then( parser.parseUniqueDocExists() ); // eslint-disable-line max-len
      if ( docFromES ) {
        this.esAssets = this.getAssets( docFromES );
        req.esDoc = docFromES;
      }
    }

    this.reqAssets = this.getAssets( req.body );

    this.body = req.body;

    return this.reqAssets;
  }

  async prepareCategoriesForUpdate( req ) {
    this.reqUnits = this.getUnits( req.body );

    this.body = req.body;

    return this.reqUnits;
  }

  async prepareDocumentForDelete( req ) {
    this.esAssets = [];

    if ( req.esDoc ) {
      this.body = req.esDoc;
      this.esAssets = this.getAssets( this.body );
    }
    return this.esAssets;
  }

  updateIfNeeded( asset, md5 ) {
    if ( !this.esAssets ) return true;

    const esAsset = this.esAssets.find( ass => ass.md5 === md5 );
    if ( !esAsset ) return true;

    this.putAsset( {
      ...asset,
      downloadUrl: esAsset.downloadUrl,
      md5: esAsset.md5
    } );

    return false;
  }

  getFilesToRemove() {
    const filesToRemove = [];
    if ( !this.esAssets ) return filesToRemove;

    this.reqAssets = this.getAssets( this.body );
    this.esAssets.forEach( ( ass ) => {
      if ( !this.reqAssets.find( val => val.md5 === ass.md5 ) ) {
        if ( ass.downloadUrl ) filesToRemove.push( { url: ass.downloadUrl } );
      }
    } );

    return filesToRemove;
  }

  async indexDocument( body ) {
    console.log( 'indexing...', JSON.stringify( body, null, 2 ) );
    const result = await this.client.index( {
      index: this.index,
      type: this.type,
      body
    } );
    return result;
  }

  async updateDocument( id, doc ) {
    console.log( 'updating...', JSON.stringify( doc, null, 2 ) );
    const result = await this.client.update( {
      index: this.index,
      type: this.type,
      id,
      body: {
        doc
      }
    } );
    return result;
  }

  async deleteDocument( id ) {
    // If there is no ID then we don't need to do anything.
    // Whatever document they tried to delete doesn't exist
    // and therefore is technically already 'deleted'
    if ( !id ) return {};
    const result = await this.client.delete( {
      index: this.index,
      type: this.type,
      id
    } );
    return result;
  }

  async findDocumentById( id ) {
    const result = await this.client.get( {
      index: this.index,
      type: this.type,
      id
    } );
    return result;
  }

  async findDocumentByQuery( query ) {
    const result = await client
      .search( {
        index: this.index,
        type: this.type,
        q: `site:${query.site} AND post_id:${query.post_id}`
      } )
      .catch( err => err );
    return result;
  }

  async getAllDocuments() {
    const result = await client
      .search( {
        index: this.index,
        type: this.type
      } )
      .catch( err => err );
    return result;
  }
}

export default AbstractModel;
