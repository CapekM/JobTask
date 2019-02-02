import { getRepository, DeleteResult } from "typeorm";
import { MonitoringResult } from "../entity/MonitoringResult";
import { MonitoredEndpoint } from "../entity/MonitoredEndpoint";
import * as request from "request";

export class MonitoringResultService {

    public async list(): Promise<MonitoringResult[]> {
        return getRepository(MonitoringResult).find();
    }

    public async getById(id: number): Promise<MonitoringResult> {
        return getRepository(MonitoringResult).findOne(id);
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

        await this.wait(newMonitoringResult); // using sleep to wait for response

        return getRepository(MonitoringResult).save(newMonitoringResult);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return getRepository(MonitoringResult).delete(id);
    }

    private async wait(entity: MonitoringResult): Promise<void> {
        // console.log("\nsleeping: ", entity.monitoredInterval);
        while (entity.monitoredInterval === 0) {
            await this.sleep(10);
        }
        // console.log("donesleeping: ", entity.monitoredInterval, "\n");
    }

    private async sleep(ms = 0): Promise<{}> {
        return new Promise(r => setTimeout(r, ms));
    }
}

export const monitoringResultService = new MonitoringResultService();
