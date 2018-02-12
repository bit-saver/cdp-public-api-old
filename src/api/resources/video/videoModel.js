import AbstractModel from '../../modules/abstractModel';

/**
 * Video Content Model helps in managing assets within JSON.
 */
class Video extends AbstractModel {
  // TODO: validate incoming model props for existence and proper data types
  // eslint-disable-next-line class-methods-use-this
  validateSchema( json ) {
    console.log( `validateSchema: ${json}` );
  }

  /**
   * Returns an array of asssets retrieved by iterating over the JSON
   * unit > sources.
   *
   * @returns {Array}
   */
  // eslint-disable-next-line class-methods-use-this
  getAssets( json ) {
    // this could have urls to process from various nodes in json doc
    const assets = [];
    json.unit.forEach( ( unit, unitIndex ) => {
      unit.source.forEach( ( src, srcIndex ) => {
        assets.push( {
          downloadUrl: src.downloadUrl,
          md5: src.md5 ? src.md5 : null,
          unitIndex,
          srcIndex
        } );
      } );
    } );
    return assets;
  }

  /**
   * Updates an asset's downloadUrl and md5 based on the unitIndex and srcIndex
   * stored in the asset object. This is okay since under all circumstances
   * the asset would have been iterated over using the objects obtained from
   * the getAssets method above.
   *
   * @param asset { downloadUrl, md5, unitIndex, srcIndex }
   */
  putAsset( asset ) {
    this.body.unit[asset.unitIndex].source[asset.srcIndex].downloadUrl = asset.downloadUrl;
    this.body.unit[asset.unitIndex].source[asset.srcIndex].md5 = asset.md5;
  }
}

export default Video;
