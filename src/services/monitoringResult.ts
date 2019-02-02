import { getRepository, DeleteResult } from "typeorm";
import { MonitoringResult } from "../entity/MonitoringResult";
import { MonitoredEndpoint } from "../entity/MonitoredEndpoint";
import * as request from "request";

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

    public async getByName(name: string, userID: number): Promise<[number, MonitoringResult[]]> {
        const endpoints = await getRepository(MonitoredEndpoint).find();
        let endpoint: MonitoredEndpoint;
        for (endpoint of endpoints) {
            if (endpoint.name === name) {
                break;
            }
        }

        let returnResults: MonitoringResult[] = [];
        if (! endpoint) {
            return [404, returnResults];
        }

        const results = await getRepository(MonitoringResult).find();
        results.forEach(result => {
            if (result.monitoredEndpoint.id === endpoint.id) {
                returnResults.push(result);
            }
        });

        if (returnResults.length > 10) {
            returnResults.sort((l, r): number => {
                if (l.date < r.date ) return -1;
                if (l.date > r.date ) return 1;
                return 0;
            });

            returnResults = returnResults.slice(returnResults.length - 10);
        }

        return [200, returnResults];
    }

    public async create(monitoredEndpoint: MonitoredEndpoint): Promise<MonitoringResult> {
        const newMonitoringResult: MonitoringResult = new MonitoringResult();
        newMonitoringResult.monitoredInterval = 0;

        // tslint:disable: ter-indent
        request({
              url : monitoredEndpoint.url,
              time : true,
              method : monitoredEndpoint.type,
            },  async (err, res, body) => {
              newMonitoringResult.statusCode = res.statusCode;
              newMonitoringResult.returnedPlayload = body;
              newMonitoringResult.monitoredInterval = Math.ceil(res.elapsedTime / 1000);
            },
        );
        // tslint:enable: ter-indent
        newMonitoringResult.monitoredEndpoint = monitoredEndpoint;
        await this.wait(newMonitoringResult); // using sleep to wait for response

        return getRepository(MonitoringResult).save(newMonitoringResult);
    }

    public async delete(id: number, userID: number): Promise<number> {
        const entity = await getRepository(MonitoringResult).findOne(id);
        if (entity.monitoredEndpoint.user.id !== userID) {
            return 404;
        }
        await getRepository(MonitoringResult).delete(id);
        return 200;
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
