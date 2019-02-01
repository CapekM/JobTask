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
require("dotenv").config();

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
    });
});

describe( "Test API", () => {
    const server = new ApiServer();
    let userA: string;
    let userB: string;

    before( "Starting server", async () => {
        server.start(8080);
        await endpointsRepo.remove(await endpointsRepo.find());
    });

    after( "Close server and connection", () => {
        server.server.close();
    });

    describe( "MonitoredEndpoints tests", () => {
        it( "UserA get token", done => {
            chai.request( server.server )
            .post( "/auth" )
            .send({
                name: "Applifting",
            })
            .end( ( err, res ) => {
                expect( res ).to.have.status( 200 );
                expect(res.body).to.have.property("token");
                userA = `Bearer ${res.body.token}`;
                chai.request( server.server )
                .get( "/ping" )
                .set("Authorization", userA)
                .end( ( err, res ) => {
                    expect( res ).to.have.status( 200 );
                    expect( res.body ).to.have.eql( "hello" );
                    expect( res.body.length ).to.have.eql( 5 );
                    done();
                });
            });
        });

        it( "UserB get token", done => {
            chai.request( server.server )
            .post( "/auth" )
            .send({
                name: "Batman",
            })
            .end( ( err, res ) => {
                expect( res ).to.have.status( 200 );
                expect(res.body).to.have.property("token");
                userB = `Bearer ${res.body.token}`;
                chai.request( server.server )
                .get( "/ping" )
                .set("Authorization", userB)
                .end( ( err, res ) => {
                    expect( res ).to.have.status( 200 );
                    expect( res.body ).to.have.eql( "hello" );
                    expect( res.body.length ).to.have.eql( 5 );
                    done();
                });
            });
        });

        describe( "MonitoredEndpoint CRUD tests", () => {
            let endpointID: number;
            it( "POST endpoint as userA", done => {
                chai.request( server.server )
                .post( "/endpoint" )
                .set("Authorization", userA)
                .send({
                    name: "Star Wars API",
                    url: "https://swapi.co/api/",
                })
                .end( ( err, res ) => {
                    expect( res ).to.have.status( 200 );
                    endpointID = res.body.id;
                    chai.request( server.server )
                    .get( "/endpoint/" + endpointID)
                    .set("Authorization", userA)
                    .end( ( err, res ) => {
                        expect( res ).to.have.status( 200 );
                        done();
                    });
                });
            });

            it( "GET endpoints as userA", done => {
                chai.request( server.server )
                .get( "/endpoints" )
                .set("Authorization", userA)
                .end( ( err, res ) => {
                    expect( res ).to.have.status( 200 );
                    expect( res.body.length ).to.have.eql( 1 );
                    done();
                });
            });

            it( "GET endpoints as userB", done => {
                chai.request( server.server )
                .get( "/endpoints" )
                .set("Authorization", userB)
                .end( ( err, res ) => {
                    expect( res ).to.have.status( 200 );
                    expect( res.body.length ).to.have.eql( 0 );
                    done();
                });
            });

            it( "DELETE endpoint as userB", () => {
                chai.request( server.server )
                .delete( "/endpoint/" + endpointID )
                .set("Authorization", userB)
                .end( ( err, res ) => {
                    expect( res ).to.have.status( 404 );
                });
            });

            it( "DELETE endpoint as userA", done => {
                chai.request( server.server )
                .delete( "/endpoint/" + endpointID )
                .set("Authorization", userA)
                .end( ( err, res ) => {
                    expect( res ).to.have.status( 200 );
                    done()
                });
            });

            it( "DELETE same endpoint as userA", done => {
                chai.request( server.server )
                .delete( "/endpoint/" + endpointID )
                .set("Authorization", userA)
                .end( ( err, res ) => {
                    expect( res ).to.have.status( 500 );
                    done();
                });
            });
        });
    });
});
