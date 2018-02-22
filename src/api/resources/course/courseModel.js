import AbstractModel from '../../modules/abstractModel';

/**
 * Video Content Model helps in managing assets within JSON.
 */
class Course extends AbstractModel {
  constructor( index = 'courses', type = 'course' ) {
    super( index, type );
  }

  validateSchema() {}

  /**
   * Returns an array of asssets retrieved by iterating over the JSON
   * unit > sources.
   *
   * @returns {Array}
   */
  // eslint-disable-next-line class-methods-use-this
  getAssets() {
    const assets = [];
    return assets;
  }

  /**
   * Updates an asset's downloadUrl and md5 based on the unitIndex and srcIndex
   * stored in the asset object. This is okay since under all circumstances
   * the asset would have been iterated over using the objects obtained from
   * the getAssets method above.
   *
   * @param asset
   */
  // eslint-disable-next-line class-methods-use-this
  putAsset( asset ) {}
}

export default Course;
