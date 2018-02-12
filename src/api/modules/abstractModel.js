import client from '../../services/elasticsearch';
import parser from '../modules/elastic/parser';

/**
 * Content Model abstraction ensures that the required methods
 * are implemented.
 */
class AbstractModel {
  constructor( index = 'video.index', type = 'video' ) {
    this.index = index;
    this.type = type;
  }

  // TODO: add correct signature, i.e. json param
  // need to disable eslint rule for this method
  // eslint-disable-next-line class-methods-use-this
  validateSchema() {
    throw new Error( 'Method not implemented: validateSchema' );
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

  async prepareDocumentForUpdate( json ) {
    // this.validateSchema( json );

    const docFromES = await this.findDocumentByQuery( json ).then( parser.parseUniqueDocExists() );
    if ( docFromES ) {
      this.esAssets = this.getAssets( docFromES._source );
      this.id = docFromES._id;
    }

    this.reqAssets = this.getAssets( json );
    this.json = json;

    return this.reqAssets;
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

    this.reqAssets = this.getAssets( this.json );
    this.esAssets.forEach( ( ass ) => {
      if ( !this.reqAssets.find( val => val.md5 === ass.md5 ) ) {
        filesToRemove.push( { url: ass.downloadUrl } );
      }
    } );

    return filesToRemove;
  }

  async indexDocument( body ) {
    const result = await client.index( {
      index: this.index,
      type: this.type,
      body
    } );
    return result;
  }

  async updateDocument( id, doc ) {
    const result = await client.update( {
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
    const result = await client.delete( {
      index: this.index,
      type: this.type,
      id
    } );
    return result;
  }

  async findDocumentById( id ) {
    const result = await client.get( {
      index: this.index,
      type: this.type,
      id
    } );
    return result;
  }

  async findDocumentByQuery( query ) {
    const result = await client.search( {
      index: this.index,
      type: this.type,
      q: `site:${query.site} AND post_id:${query.post_id}`
    } );
    return result;
  }
}

export default AbstractModel;
