process.env.NODE_ENV = "test";
// tslint:disable: no-implicit-dependencies
import * as chai from "chai";
// tslint:disable: no-duplicate-imports
import { expect } from "chai";
import chaiHttp = require( "chai-http" );
import { ApiServer } from "../src/server";
import { createBasicUsers, User } from "../src/entity/User";
import { getRepository, createConnection, Connection } from "typeorm";
import { after, before } from "mocha";

chai.use( chaiHttp );

describe( "User", () => {
    let connection: Connection;
    before( "Create users", async () => {
        connection = await createConnection();
        getRepository(User).remove(await getRepository(User).find());
        await createBasicUsers();
    });

    after( "Closing connectin", async () => {
        connection.close();
    });

    it( "chcek user 1", async () => {
        const users = await getRepository(User).find();
        let user: User;
        users.forEach((u) => {
            if (u.username === "Applifting") {
                user = u;
            }
        });
        expect( user.username ).to.equal( "Applifting" );
        expect( user.email ).to.equal( "info@applifting.cz" );
        expect( user.accessToken ).to.equal( "040ff087-6d86-4f12-bc63-9c0a4781614a" );
    });
});

/*
  * Test the /GET route
  */
describe( "HTTP Server Test", () => {
    const server = new ApiServer();

    before( "Starting server", (done) => {
        server.start(8080);
        done();
    });

    after( () => {
        server.server.close();
    });

    describe( "GET /ping", () => {
        it( "ping", () => {
            chai.request( server.server )
            .get( "/ping" )
            .end( ( err, res ) => {
                expect( res ).to.have.status( 200 );
                expect( res.body ).to.have.eql( "hello" );
                expect( res.body.length ).to.have.eql( 5 );
            });
        });
    });
});
