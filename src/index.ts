import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApiServer } from "./server/index";

createConnection().then(async (connection) => {

    const server = new ApiServer();
    server.start(+process.env.PORT || 8080);

}).catch(error => console.log(error));
