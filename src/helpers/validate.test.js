import { expect } from 'chai';
import * as validate from './validate';

describe( 'Validate', () => {
  let state;

  describe( '#validate.string()', () => {
    beforeEach( () => {
      state = { options: {}, error: {} };
    } );

    it( 'should update the state to reflect the new props: query == state', () => {
      expect( validate.string( { prop1: 'index', prop2: 'id' }, state ) ).to.deep.equal( { options: { prop1: 'index', prop2: 'id' }, error: {} } );
    } );

    it( 'should not return object property on state if object property value does not exist', () => {
      expect( validate.string( { prop1: 'index', prop2: undefined }, state ) ).to.deep.equal( { options: { prop1: 'index' }, error: {} } );
    } );

    it( 'should return an error object with applicable error message if non string value is present', () => {
      const object = {
        prop1: 'index', prop2: 3, prop3: {}, prop4: []
      };
      expect( validate.string( object, state ) ).to.deep.equal( {
        options: { prop1: 'index' },
        error: {
          prop2: 'Value must be a string',
          prop3: 'Value must be a string',
          prop4: 'Value must be a string'
        }
      } );
    } );
  } );

  describe( '#validate.number()', () => {
    beforeEach( () => {
      state = { options: {}, error: {} };
    } );
    it( 'should return an error object with applicable error message if non number value is present', () => {
      expect( validate.number( { prop1: '3', prop2: {}, prop3: [] }, state ) ).to.deep.equal( {
        options: {},
        error: {
          prop1: 'Value must be a number',
          prop2: 'Value must be a number',
          prop3: 'Value must be a number'
        }
      } );
    } );
  } );

  describe( '#validate.array()', () => {
    beforeEach( () => {
      state = { options: {}, error: {} };
    } );

    it( 'should return a property with array value', () => {
      const object = { prop1: [ 'item1', 'item2' ] };
      expect( validate.array( object, state ) ).to.deep.equal( { options: { prop1: [ 'item1', 'item2' ] }, error: {} } );
    } );

    it( 'should return an applicable error is object property is not an array', () => {
      const object = {
        prop1: '3', prop2: 3, prop3: {}, prop4: null, prop5: '', prop6: []
      };
      expect( validate.array( object, state ) ).to.deep.equal( {
        options: { prop6: [] },  // May need to update function to disallow empty arrays
        error: {
          prop1: 'Value must be a String[]',
          prop2: 'Value must be a String[]',
          prop3: 'Value must be a String[]',
          prop6: 'Value must be String or String[]'
        }
      } );
    } );

    it( 'should return an applicable error if array contains non string values', () => {
      const object = { prop1: [ 'item1', 3 ] }
      expect( validate.array( object, state ) ).to.deep.equal( {
        options: {},
        error: {}
      } )
    } );
  } );
} );
