import { getRepository, DeleteResult } from "typeorm";
import { MonitoringResult } from "../entity/MonitoringResult";
import { MonitoredEndpoint } from "../entity/MonitoredEndpoint";
import * as request from "request";
import { Request } from "restify";

const errors = require("restify-errors");

export class MonitoringResultService {

    public async list(userID: number): Promise<MonitoringResult[]> {
        const results = await getRepository(MonitoringResult).find();
        const returnResults: MonitoringResult[] = [];
        results.forEach((result) => {
            if (result.monitoredEndpoint.user.id === userID) {
                returnResults.push(result);
            }
        });
        return returnResults;
    }

    public async getByName(name: string, userID: number): Promise<MonitoringResult[]> {
        const endpoints = await getRepository(MonitoredEndpoint).find();
        let endpoint: MonitoredEndpoint;
        for (endpoint of endpoints) {
            if (endpoint.name === name) {
                break;
            }
        }
        if (! endpoint) {
            throw new errors.NotFoundError();
        }

        let returnResults: MonitoringResult[] = [];
        const results = await getRepository(MonitoringResult).find();
        results.forEach(result => {
            if (result.monitoredEndpoint.id === endpoint.id) {
                returnResults.push(result);
            }
        });

        if (returnResults.length > 10) {
            returnResults.sort((l, r): number => {
                if (l.date < r.date) return -1;
                if (l.date > r.date) return 1;
                return 0;
            });

            returnResults = returnResults.slice(returnResults.length - 10);
        }

        return returnResults;
    }

    public async create(req: Request, userID: number): Promise<MonitoringResult> {
        const match: string = (typeof req.body.name !== "undefined" && req.body.name) ? req.body.name : req.body.url;
        const endpoints = await getRepository(MonitoredEndpoint).find();
        let endpoint: MonitoredEndpoint;
        let flag: boolean = true;
        for (endpoint of endpoints) {
            if (endpoint.name === match || (endpoint.url === match && endpoint.type === req.body.type)) {
                flag = false;
                break;
            }
        };
        const newMonitoringResult: MonitoringResult = new MonitoringResult();
        if (flag) {
            throw new errors.BadRequestError();
        }
        if (endpoint.user.id !== userID) {
            throw new errors.ForbiddenError();
        }

        newMonitoringResult.monitoredInterval = 0;

        request({
            url : endpoint.url,
            time : true,
            method : endpoint.type
        }, async (err, res, body) => {
            newMonitoringResult.statusCode = res.statusCode;
            newMonitoringResult.returnedPlayload = body;
            newMonitoringResult.monitoredInterval = Math.ceil(res.elapsedTime / 1000);
        });

        newMonitoringResult.monitoredEndpoint = endpoint;
        await this.wait(newMonitoringResult); // using sleep to wait for response

        return getRepository(MonitoringResult).save(newMonitoringResult);
    }

    public async delete(id: number, userID: number): Promise<DeleteResult> {
        const entity = await getRepository(MonitoringResult).findOne(id);
        if (! entity) {
            throw new errors.NotFoundError();
        }
        if (entity.monitoredEndpoint.user.id !== userID) {
            throw new errors.ForbiddenError();
        }
        return getRepository(MonitoringResult).delete(id);
    }

    private async wait(entity: MonitoringResult): Promise<void> {
        while (entity.monitoredInterval === 0) {
            await this.sleep(10);
        }
    }

    private async sleep(ms = 0): Promise<{}> {
        return new Promise(r => setTimeout(r, ms));
    }
}

export const monitoringResultService = new MonitoringResultService();
