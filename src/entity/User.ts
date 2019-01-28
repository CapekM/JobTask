import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import { MonitoredEndpoint } from './MonitoredEndpoint';

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
