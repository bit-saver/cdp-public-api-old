import AbstractModel from '../../modules/abstractModel';
import Ajv from 'ajv';
import languageSchema from '../../modules/schema/language';

/**
 * Video Content Model helps in managing assets within JSON.
 */
class Video extends AbstractModel {
  constructor( index = 'videos', type = 'video' ) {
    super( index, type );

    // compile only once
    this.compileSchema();
  }

  static validateSchema( body ) {
    const valid = Video.validate( body );
    return {
      valid,
      errors: Video.validate.errors
    };
  }

  // eslint-disable-next-line class-methods-use-this
  compileSchema() {
    const schema = {
      title: 'Video',
      type: 'object',
      properties: {
        post_id: { type: 'integer' },
        site: { type: 'string' },
        type: { type: 'string' },
        published: { type: 'string' },
        modified: { type: 'string' },
        owner: { type: 'string' },
        author: { type: 'string' },
        duration: { type: 'number' },
        unit: {
          type: 'array',
          default: [{ source: [] }],
          items: {
            type: 'object',
            properties: {
              language: languageSchema,
              title: { type: 'string' },
              desc: { type: 'string' },
              categories: {
                type: 'array',
                items: { type: 'string' }
              },
              tags: {
                type: 'array',
                items: { type: 'string' }
              },
              source: {
                type: 'array',
                default: [],
                items: {
                  type: 'object',
                  properties: {
                    burnedInCaptions: { type: 'string' },
                    downloadUrl: { type: 'string' },
                    streamUrl: { type: 'string' },
                    filetype: { type: 'string' },
                    md5: { type: 'string' },
                    size: {
                      type: 'object',
                      properties: {
                        width: { type: 'number' },
                        height: { type: 'number' },
                        filesize: { type: 'number' },
                        bitrate: { type: 'number' }
                      }
                    }
                  }
                }
              },
              transcript: {
                type: 'object',
                properties: {
                  srcUrl: { type: 'string' },
                  md5: { type: 'string' },
                  text: { type: 'string' }
                }
              },
              srt: {
                type: 'object',
                properties: {
                  srcUrl: { type: 'string' },
                  md5: { type: 'string' }
                }
              }
            }
          }
        }
      },
      required: ['post_id', 'site']
    };

    // 'useDefaults' adds a default value during validation if it is listed
    // 'removeAdditional' removes any properties during validation that are not in the schema
    const ajv = new Ajv( { useDefaults: true, removeAdditional: 'all', coerceTypes: true } );
    Video.validate = ajv.compile( schema );
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
