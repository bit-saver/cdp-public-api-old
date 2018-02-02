/**
 * Content Model abstraction ensures that the required methods
 * are implemented.
 */
class ContentModel {
  constructor( data ) {
    this.json = data;
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
}
