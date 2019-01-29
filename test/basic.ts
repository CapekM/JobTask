process.env.NODE_ENV = "test";
// tslint:disable: no-implicit-dependencies
import * as chai from "chai";
// tslint:disable: no-duplicate-imports
import { expect } from "chai";
import chaiHttp = require("chai-http");
import { ApiServer } from "../src/server";
import { createBasicUsers, User } from "../src/entity/User";
import { createConnection, Connection, Repository } from "typeorm";
import { after, before } from "mocha";
import { MonitoredEndpoint } from "../src/entity/MonitoredEndpoint";

chai.use( chaiHttp );

let connection: Connection;
let userRepo: Repository<User>;
let endpointsRepo: Repository<MonitoredEndpoint>;

before( "Create connection", async () => {
    connection = await createConnection();
    userRepo = connection.getRepository(User);
    endpointsRepo = connection.getRepository(MonitoredEndpoint);
});

after( "Close connection", async () => {
    await userRepo.remove(await userRepo.find());
    connection.close();
});

describe( "Users", () => {

    it( "delete users", async () => {
        await userRepo.remove(await userRepo.find());
        const users = await userRepo.find();
        expect( users.length ).to.equal( 0 );
    });

    it( "create users", async () => {
        await createBasicUsers();
        const users = await userRepo.find();
        expect( users.length ).to.equal( 2 );
    });

    it( "chcek user 1", async () => {
        const users = await userRepo.find();
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

describe( "API Test", () => {
    const server = new ApiServer();

    before( "Starting server", async () => {
        server.start(8080);
        await endpointsRepo.remove(await endpointsRepo.find());
    });

    after( "Close server and connection", () => {
        server.server.close();
    });

    describe( "Ping", () => {
        it( "GET /ping", () => {
            chai.request( server.server )
            .get( "/ping" )
            .end( ( err, res ) => {
                expect( res ).to.have.status( 200 );
                expect( res.body ).to.have.eql( "hello" );
                expect( res.body.length ).to.have.eql( 5 );
            });
        });
    });

    describe( "Endpoints", () => {
        it( "POST endpoint", () => {
            chai.request( server.server )
            .post( "/endpoint" )
            .send({
                name: "Star Wars API",
                url: "https://swapi.co/api/",
            })
            .end( ( err, res ) => {
                expect( res ).to.have.status( 200 );
            });
        });

        // it( "POST fake endpoint", () => {
        //     chai.request( server.server )
        //     .post( "/endpoint" )
        //     .send({
        //         name: "Fake",
        //     })
        //     .end( ( err, res ) => {
        //         expect( res ).to.have.status( 404 );
        //     });
        // });

        it( "GET endpoints", async () => {
            chai.request( server.server )
            .get( "/endpoints" )
            .end( async ( err, res ) => {
                expect( res ).to.have.status( 200 );
                // expect( res.body ).to.have.eql( [] );
                console.log(res.body);
            });
        });
    });

    describe( "Results", () => {
        it( "GET /results", () => {
            chai.request( server.server )
            .get( "/results" )
            .end( ( err, res ) => {
                expect( res ).to.have.status( 200 );
                expect( res.body ).to.have.eql( [] );
            });
        });
    });
});
