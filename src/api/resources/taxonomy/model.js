import AbstractModel from '../../modules/abstractModel';

class Taxonomy extends AbstractModel {
  constructor( index = 'taxonomy', type = 'term' ) {
    super( index, type );
  }
}

export default Taxonomy;
