import { Entity, PrimaryGeneratedColumn, Column, OneToMany, getRepository } from "typeorm";
import { MonitoredEndpoint } from "./MonitoredEndpoint";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    accessToken: string; // UUID

    @OneToMany(type => MonitoredEndpoint, monitoredEndpoint => monitoredEndpoint.user)
    monitoredEndpoints: MonitoredEndpoint[];
}

function createUser(username: string, email: string, token: string): User {
    const user = new User();
    user.username = username;
    user.email = email;
    user.accessToken = token;
    return user;
}

export async function createBasicUsers(): Promise<void> {
    const users = await getRepository(User).find();
    let isInDB: boolean = false;
    users.forEach((user) => {
        if (user.username === "Applifting") {
            isInDB = true;
        }
    });
    if (!isInDB) {
// tslint:disable: max-line-length
        await getRepository(User).save(createUser("Applifting", "info@applifting.cz", "040ff087-6d86-4f12-bc63-9c0a4781614a"));
        await getRepository(User).save(createUser("Batman", "batman@example.com", "6d9f2420-7fbc-4978-b945-3773d3e16141"));
    }
}
