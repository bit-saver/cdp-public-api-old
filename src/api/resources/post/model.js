import AbstractModel from '../../modules/abstractModel';
import Ajv from 'ajv';
import languageSchema from '../../modules/schema/language';

/**
 * Video Content Model helps in managing assets within JSON.
 */
class Post extends AbstractModel {
  constructor( index = 'posts', type = 'post' ) {
    super( index, type );

    // compile only once
    // this.compileSchema();
  }

  static validateSchema( body ) {
    const valid = Post.validate( body );
    return {
      valid,
      errors: Post.validate.errors
    };
  }

  // eslint-disable-next-line class-methods-use-this
  compileSchema() {
    // TODO: build out shcema
    const schema = {};

    // 'useDefaults' adds a default value during validation if it is listed
    // 'removeAdditional' removes any properties during validation that are not in the schema
    const ajv = new Ajv( { useDefaults: true, removeAdditional: 'all' } );
    Post.validate = ajv.compile( schema );
  }

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

export default Post;
