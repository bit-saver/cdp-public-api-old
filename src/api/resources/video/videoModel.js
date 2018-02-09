import AbstractModel from '../../modules/abstractModel';

/**
 * Video Content Model helps in managing assets within JSON.
 */
class Video extends AbstractModel {
  /**
   * Returns an array of asssets retrieved by iterating over the JSON
   * unit > sources.
   *
   * @returns {Array}
   */
  getAssets() {
    const assets = [];
    this.json.unit.forEach( ( unit, unitIndex ) => {
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
    this.json.unit[asset.unitIndex].source[asset.srcIndex].downloadUrl = asset.downloadUrl;
    this.json.unit[asset.unitIndex].source[asset.srcIndex].md5 = asset.md5;
  }
}

export default Video;
