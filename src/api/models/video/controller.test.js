import { expect } from 'chai';
import * as controller from './controller';

describe( 'video test', () => {
  it( 'should execute', () => {
    expect( '3' ).to.eq( '3' );
  } );
} );

// console.log( 'video test' );
// describe( 'Video controller', () => {
//   describe( '#controller.get()', () => {
//     it( 'should export a function', () => {
//       expect( controller.get ).to.be.a( 'function' );
//     } );
//   } );
// } );

//  --require babel-core/register
// describe( 'server', () => {
//   const request = supertest( server );

//   // checks that server returns success response when 'GET /posts' is performed
//   // response content is not verified here yet. It will be done in the next
//   // iteration
//   describe( 'GET /posts', () => it( 'responds with OK', () => request.get( '/posts' ).expect( 200 ) ) );
// } );
