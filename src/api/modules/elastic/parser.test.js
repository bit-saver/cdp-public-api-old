import { expect } from 'chai';
import parser from './parser';

describe.only( 'Modules.elastic', () => {
  describe( 'parser', () => {
    const testID = 1;
    let testObj;
    describe( 'parseCreateRequest', () => {
      testObj = { body: 'test body' };
      const succResult = { _id: '1', found: true };
      it( 'should be a function', () => {
        expect( parser.parseCreateResult ).to.be.a( 'function' );
      } );
      it( 'should return an id and the provided body', () => {
        parser
          .parseCreateResult( testObj )( { ...succResult, result: 'created' } )
          .then( ( result ) => {
            expect( result ).to.deep.equals( { id: '1', ...testObj } );
          } )
          .catch( ( err ) => {} );
      } );
      it( 'should reject with input if not created', () => {
        parser
          .parseCreateResult( testObj )( { ...succResult, result: 'created' } )
          .then( ( result ) => {
            // noop failure
          } )
          .catch( ( err ) => {
            expect( err ).to.deep.equals( testObj );
          } );
      } );
    } );
    describe( 'parseGetResult', () => {
      testObj = { body: 'test body' };
      it( 'should be a function', () => {
        expect( parser.parseGetResult ).to.be.a( 'function' );
      } );
      it( 'should return a formatted object', () => {
        parser
          .parseGetResult( testID )( { _id: '1', _source: testObj, found: true } )
          .then( ( result ) => {
            expect( result ).to.deep.equals( { ...testObj, id: '1' } );
          } )
          .catch( ( err ) => {} );
      } );
      it( 'should reject with input if not found', () => {
        parser
          .parseGetResult( testID )( { found: false } )
          .then( ( result ) => {
            // noop failure
          } )
          .catch( ( err ) => {
            expect( err ).to.equal( testID );
          } );
      } );
    } );
    describe( 'parseUpdateResult', () => {
      testObj = { body: 'test body2' };
      it( 'should be a function', () => {
        expect( parser.parseUpdateResult ).to.be.a( 'function' );
      } );
      it( 'should reject with the original input if not found', () => {
        parser
          .parseUpdateResult( testID, testObj )( { found: false } )
          .then( ( result ) => {
            // noop failure
          } )
          .catch( ( err ) => {
            expect( err ).to.equal( testID );
          } );
      } );
      it( 'should return the updated doc if updated', () => {
        parser
          .parseUpdateResult( testID, testObj )( { _id: 1, result: 'updated', found: true } )
          .then( ( result ) => {
            expect( result ).to.equal( { id: `${testID}`, ...testObj } );
          } )
          .catch( ( err ) => {
            // noop failure
          } );
      } );
    } );
    describe( 'parseDeleteResult', () => {
      testObj = { body: 'test body2' };
      it( 'should be a function', () => {
        expect( parser.parseUpdateResult ).to.be.a( 'function' );
      } );
      it( 'should reject with the original input if not found', () => {
        parser
          .parseUpdateResult( testID, testObj )( { found: false } )
          .then( ( result ) => {
            // noop failure
          } )
          .catch( ( err ) => {
            expect( err ).to.equal( testID );
          } );
      } );
      it( 'should return the deleted ID as success', () => {
        parser
          .parseUpdateResult( testID, testObj )( { _id: 1, result: 'deleted', found: false } )
          .then( ( result ) => {
            expect( result ).to.equal( `${testID}` );
          } )
          .catch( ( err ) => {
            // noop failure
          } );
      } );
    } );
  } );
} );
