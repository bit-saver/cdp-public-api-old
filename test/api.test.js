import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/server';
import esQueryFactory from '../src/api/modules/esDocumentQuery';
import client from '../src/services/elasticsearch';

chai.use( chaiHttp );

const createApiTest = ( index, type, body ) => {
  describe( `/v1/${type}`, () => {
    const esQuery = esQueryFactory( client, index, type );

    // INDEX (CREATE)  POST v1/[resource]
    describe( `POST /${type}`, () => {
      let result;

      // remove document after test
      after( () => {
        esQuery.deleteDocument( result.body.id ); // TODO: need to resolve this promise
      } );

      it( `responds with Created and returns a ${type}`, async () => {
        result = await chai
          .request( app )
          .post( `/v1/${type}` )
          .send( body );

        // Check for status, content type and correct json
        expect( result ).to.have.status( 201 );
        expect( result ).to.be.json;
      } );
    } );

    // GET v1/[resource]/[id]
    describe( `GET /${type}[id]`, () => {} );

    // UPDATE v1/[resource]
    describe( `UPDATE /${type}/[id]`, () => {} );

    // DELETE  v1/[resource]/[id]
    describe( `DELETE /${type}[id]`, () => {} );
  } );
};

export default createApiTest;
