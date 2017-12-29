import { expect } from 'chai';
import * as validate from './validate';

describe( 'Validate', () => {
  let query = {};
  const state = {
    options: {},
    error: {}
  };

  describe( '#validate.string()', () => {
    query = {
      index: 'index',
      id: 'id'
    };

    it( 'should return an object with options == query', () => {
      expect( validate.string( query, state ) ).to.deep.equal( { options: { index: 'index', id: 'id' }, error: {} } );
    } );
  } );
} );

