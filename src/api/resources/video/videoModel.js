import AbstractModel from '../../modules/abstractModel';

/**
 * Video Content Model helps in managing assets within JSON.
 */
class Video extends AbstractModel {
  constructor( index = 'videos', type = 'video' ) {
    super( index, type );
  }
  // TODO: validate incoming model props for existence and proper data types
  validateSchema() {
    // console.log( 'validateSchema:', this.body );
    if ( !this.body ) throw new Error( 'Missing request body.' );
    // check each level
    // level 1
    //  include: site*, post_id*, type, published, modified, owner, author, duration
    //  unit[]
    //    level 2
    //      language
    //        language_code, locale, text_direction, display_name, native_name, different_language
    //      title, desc
    //      categories[]
    //      tags[]
    //      source[]
    //        level 3
    //          burnedInCaptions, downloadUrl, md5, streamUrl, filetype
    //          size
    //            width, height, filesize, bitrate
    //      transcript
    //        srcUrl, md5, text
    //      srt
    //        srcUrl, md5
    if ( !this.body.site ) throw new Error( 'Missing required property: site' );
    if ( !this.body.post_id ) throw new Error( 'Missing required property: post_id' );

    // The allowed list contains allowed properties and the properties allowed
    // inside those properties.
    // Each object key represents a property except for 'body' which represents the root level.
    const allowed = {
      body: [
        'site',
        'post_id',
        'type',
        'published',
        'modified',
        'owner',
        'author',
        'duration',
        'unit'
      ],
      unit: [
        'language', 'title', 'desc', 'categories', 'tags', 'source', 'transcript', 'srt'
      ],
      language: [
        'language_code',
        'locale',
        'text_direction',
        'display_name',
        'native_name',
        'different_language'
      ],
      categories: [],
      tags: [],
      source: [
        'burnedInCaptions', 'downloadUrl', 'md5', 'streamUrl', 'filetype', 'size'
      ],
      size: [
        'width', 'height', 'filesize', 'bitrate'
      ],
      transcript: [
        'srcUrl', 'md5', 'text'
      ],
      srt: ['srcUrl', 'md5']
    };

    const objectArrays = ['unit', 'source'];

    const filterLevel = ( primaryKey, raw ) => {
      // If we have a key for this property AND a non empty value
      // then we must filter out anything not specified
      if ( allowed[primaryKey] ) {
        // Check for empty value and simply return the values if so
        if ( allowed[primaryKey].length < 1 ) return raw;
        // Non empty so let's filter out the non specified properties
        return Object.keys( raw )
          .filter( key => allowed[primaryKey].includes( key ) ) // list of allowed keys
          .reduce( ( obj, key ) => {
            const ret = obj;
            // If this key holds an array of objects, we need to iterate each one
            if ( objectArrays.includes( key ) ) {
              if ( raw[key] instanceof Array ) {
                const replace = [];
                raw[key].forEach( ( unit ) => {
                  replace.push( filterLevel( key, unit ) );
                } );
                ret[key] = replace;
              } else {
                ret[key] = [];
              }
            } else if ( allowed[key] ) {
              ret[key] = filterLevel( key, raw[key] );
            } else ret[key] = raw[key];
            return ret;
          }, {} );
      }
    };

    return filterLevel( 'body', this.body );
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
