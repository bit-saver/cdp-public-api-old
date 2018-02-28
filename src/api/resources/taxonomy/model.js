import AbstractModel from '../../modules/abstractModel';

class Taxonomy extends AbstractModel {
  constructor( index = 'taxonomy', type = 'term' ) {
    super( index, type );
  }

  /**
   * Construct a taxonomy tree from a flat array of terms where each term has a parent
   * and an array of child terms (children).
   *
   * @param terms
   * @returns {Array}
   */
  static constructTree( terms ) {
    const tree = [];
    terms.filter( term => term.parent !== null ).forEach( ( term ) => {
      const found = terms.find( val => val._id === `${term.parent}` );
      if ( found ) found.children.push( term );
    } );
    terms.forEach( ( term ) => {
      if ( term.parent === null ) tree.push( term );
    } );
    return tree;
  }
}

export default Taxonomy;
