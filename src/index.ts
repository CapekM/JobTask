import "reflect-metadata";
import { createConnection } from "typeorm";
import { ApiServer } from "./server/index";
import { createBasicUsers } from "./entity/User";

createConnection().then(async (connection) => {
    await createBasicUsers()    ;
    const server = new ApiServer();
    server.start(+process.env.PORT || 8080);

}).catch(error => console.log(error));
