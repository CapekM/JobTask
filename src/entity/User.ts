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

    @OneToMany(type => MonitoredEndpoint, monitoredEndpoint => monitoredEndpoint.user)
    monitoredEndpoints: MonitoredEndpoint[];
}

function createUser(username: string, email: string): User {
    const user = new User();
    user.username = username;
    user.email = email;
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
        await getRepository(User).save(createUser("Applifting", "info@applifting.cz"));
        await getRepository(User).save(createUser("Batman", "batman@example.com"));
    }
}
