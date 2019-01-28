import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne} from "typeorm";
import { MonitoredEndpoint } from "./MonitoredEndpoint";

@Entity()
export class MonitoringResult {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    date: Date;

    @Column("integer")
    statusCode: number;

    @Column()
    returnedPlayload: string;

    @Column("integer")
    monitoredInterval: number;

    @ManyToOne(type => MonitoredEndpoint, monitoredEndpoint => monitoredEndpoint.monitoringResults)
    monitoredEndpoint: MonitoredEndpoint;
}
