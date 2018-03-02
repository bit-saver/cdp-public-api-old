import AbstractModel from '../../modules/abstractModel';

class Taxonomy extends AbstractModel {
  constructor( index = 'languages', type = 'language' ) {
    super( index, type );
  }
}

export default Taxonomy;
