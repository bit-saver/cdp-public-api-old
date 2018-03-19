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
        categories: {
          type: 'array',
          default: [],
          items: { type: 'string' }
        },
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
                    stream: {
                      type: 'object',
                      default: {
                        url: '',
                        uid: ''
                      },
                      properties: {
                        url: { type: 'string' },
                        uid: { type: 'string' },
                        thumbnail: { type: 'string' }
                      }
                    },
                    filetype: { type: 'string' },
                    md5: { type: 'string' },
                    size: {
                      type: ['object', 'null'],
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
    // 'coerceTypes' will coerce to appropriate type.  using to coerce string number to number
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
          stream: src.stream || {},
          md5: src.md5 || null,
          size: src.size || null,
          unitIndex,
          srcIndex,
          assetType: 'source'
        } );
      } );
      if ( unit.transcript ) {
        const trans = unit.transcript;
        assets.push( {
          downloadUrl: trans.srcUrl,
          md5: trans.md5 || null,
          unitIndex,
          srcIndex: -1,
          assetType: 'transcript'
        } );
      }
      if ( unit.srt ) {
        assets.push( {
          downloadUrl: unit.srt.srcUrl,
          md5: unit.srt.md5 || null,
          unitIndex,
          srcIndex: -1,
          assetType: 'srt'
        } );
      }
    } );
    return assets;
  }

  /**
   * Updates an asset's downloadUrl, streamUrl and md5 based on the unitIndex and srcIndex
   * stored in the asset object. This is okay since under all circumstances
   * the asset would have been iterated over using the objects obtained from
   * the getAssets method above.
   *
   * @param asset { downloadUrl, streamUrl, md5, unitIndex, srcIndex, assetType }
   */
  putAsset( asset ) {
    if ( asset.assetType === 'source' ) {
      this.body.unit[asset.unitIndex].source[asset.srcIndex].downloadUrl = asset.downloadUrl;
      this.body.unit[asset.unitIndex].source[asset.srcIndex].stream = asset.stream;
      this.body.unit[asset.unitIndex].source[asset.srcIndex].md5 = asset.md5;
      this.body.unit[asset.unitIndex].source[asset.srcIndex].size = asset.size;
    } else {
      this.body.unit[asset.unitIndex][asset.assetType].srcUrl = asset.downloadUrl;
      this.body.unit[asset.unitIndex][asset.assetType].md5 = asset.md5;
    }
  }

  /**
   * Returns an array of language units retrieved by iterating over the JSON
   *
   * @returns {Array}
   */
  // eslint-disable-next-line class-methods-use-this
  getUnits( json ) {
    const units = [];
    json.unit.forEach( ( unit, index ) => {
      units.push( {
        index,
        locale: unit.language.locale,
        categories: []
      } );
    } );
    return units;
  }

  putUnit( unit ) {
    this.body.unit[unit.index].categories = unit.categories;
  }

  deleteRootCategories() {
    delete this.body.categories;
  }
}

export default Video;
