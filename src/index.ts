import 'reflect-metadata';
import {createConnection, Connection, getRepository} from 'typeorm';
import {User} from './entity/User';
import {ApiServer} from './server/index';

function createUser(username: string, email: string, token: string): User {
    const user = new User();
    user.username = username;
    user.email = email;
    user.accessToken = token;
    console.log('Saved a new user with id: ', user.id);
    return user;
}

createConnection().then(async connection => {

    const users = await getRepository(User).find();
    let isInDB: boolean = false;
    users.forEach(user => {
        if (user.username === 'Applifting') {
            isInDB = true;
        }
    });
    if (!isInDB) {
// tslint:disable-next-line: max-line-length
        await connection.manager.save(createUser('Applifting', 'info@applifting.cz', '040ff087-6d86-4f12-bc63-9c0a4781614a'));
// tslint:disable-next-line: max-line-length
        await connection.manager.save(createUser('Batman', 'batman@example.com', '6d9f2420-7fbc-4978-b945-3773d3e16141'));
    }

    console.log('Loading users from the database...');
    console.log('Loaded users: ', users, '\n');

    const server = new ApiServer();

    server.start(+process.env.PORT || 8080);

}).catch(error => console.log(error));
