import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { MonitoringResult } from "./MonitoringResult";

export enum requestType {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DEL = "DELETE",
}

@Entity()
export class MonitoredEndpoint {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        default: "",
    })
    name: string;

    @Column({
        default: "",
    })
    url: string;

    @Column({
        default: requestType.GET,
    })
    type: requestType;

    @CreateDateColumn()
    creationDate: Date;

    @UpdateDateColumn()
    lastCheckDate: Date;

    @ManyToOne(type => User, user => user.monitoredEndpoints, {
        eager: true,
        onDelete: "CASCADE",
    })
    user: User;

    @OneToMany(type => MonitoringResult, monitoringResults => monitoringResults.monitoredEndpoint)
    monitoringResults: MonitoringResult[];
}
