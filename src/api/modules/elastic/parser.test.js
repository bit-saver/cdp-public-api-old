import { expect } from 'chai';
import parser from './parser';

describe.only( 'Modules.elastic', () => {
  describe( 'parser', () => {
    const testID = 1;
    let testObj;
    let result;
    describe( 'parseCreateRequest', () => {
      testObj = { body: 'test body' };
      const succResult = { _id: '1', found: true };
      it( 'should be a function', () => {
        expect( parser.parseCreateResult ).to.be.a( 'function' );
      } );
      it( 'should return an id and the provided body', async () => {
        result = await parser.parseCreateResult( testObj )( {
          ...succResult,
          result: 'created'
        } );
        expect( result ).to.deep.equals( { id: '1', ...testObj } );
      } );
      it( 'should reject with input if not created', async () => {
        await parser
          .parseCreateResult( testObj )( { ...succResult, result: 'created' } )
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
      it( 'should return a formatted object', async () => {
        result = await parser.parseGetResult( testID )( {
          _id: '1',
          _source: testObj,
          found: true
        } );
        expect( result ).to.deep.equals( { ...testObj, id: '1' } );
      } );
      it( 'should reject with input if not found', async () => {
        await parser
          .parseGetResult( testID )( { found: false } )
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
      it( 'should reject with the original input if not found', async () => {
        await parser
          .parseUpdateResult( testID, testObj )( { found: false } )
          .catch( ( err ) => {
            expect( err ).to.equal( testID );
          } );
      } );
      it( 'should return the updated doc if updated', async () => {
        result = await parser.parseUpdateResult( testID, testObj )( {
          _id: '1',
          result: 'updated',
          found: true
        } );
        expect( result ).to.deep.equal( { id: `${testID}`, ...testObj } );
      } );
    } );
    describe( 'parseDeleteResult', () => {
      testObj = { body: 'test body2' };
      it( 'should be a function', () => {
        expect( parser.parseDeleteResult ).to.be.a( 'function' );
      } );
      it( 'should reject with the original input if not found', async () => {
        await parser
          .parseDeleteResult( testID, testObj )( { found: false } )
          .catch( ( err ) => {
            expect( err ).to.equal( testID );
          } );
      } );
      it( 'should return the deleted ID as success', async () => {
        result = await parser.parseDeleteResult( testID, testObj )( {
          _id: '1',
          result: 'deleted',
          found: false
        } );
        expect( result ).to.equal( testID );
      } );
    } );
  } );
} );
