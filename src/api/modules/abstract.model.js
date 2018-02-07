import client from '../../services/elasticsearch';

/**
 * Content Model abstraction ensures that the required methods
 * are implemented.
 */
class AbstractModel {
  constructor( index = 'video.index', type = 'video' ) {
    // this.json = data;
    this.index = index;
    this.type = type;
  }

  /**
   * Returns the JSON representation (used in all requests and responses)
   *
   * @returns JSON
   */
  getJson() {
    return this.json;
  }

  set id( id ) {
    this.json.id = id;
  }

  get id() {
    return this.json.id;
  }

  // eslint-disable-next-line class-methods-use-this
  getAssets() {
    throw new Error( 'Method not implemented: getAssets' );
  }

  // eslint-disable-next-line class-methods-use-this
  putAsset() {
    throw new Error( 'Method not implemented: putAsset' );
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
