import {Controller} from "./controller";
import {HttpServer} from "../server/httpServer";
import {Request, Response} from "restify";
import { getRepository } from "typeorm";
import { MonitoredEndpoint } from "../entity/MonitoredEndpoint";
import { monitoringResultService } from "../services/monitoringResult";
import { getUserID } from "../services/auth";

export class MonitoreingResultController implements Controller {
    public initialize(httpServer: HttpServer): void {
        httpServer.get("results", this.list.bind(this));
        httpServer.get("results/:name", this.getByName.bind(this));
        httpServer.post("result", this.create.bind(this));
        httpServer.del("result/:id", this.remove.bind(this));
    }

    private async list(req: Request, res: Response): Promise<void> {
        res.send(await monitoringResultService.list(getUserID(req.headers.authorization)));
    }

    private async getByName(req: Request, res: Response): Promise<void> {
        const message = await monitoringResultService.getByName(req.params.name, getUserID(req.headers.authorization));
        res.send( (message[0] !== 200) ? message[0] : message[0], message[1]);
    }

    private async create(req: Request, res: Response): Promise<void> {
        const match: string = (typeof req.body.name !== "undefined" && req.body.name)
        ? req.body.name : req.body.url;
        const endpoints = await getRepository(MonitoredEndpoint).find();
        let entity: MonitoredEndpoint;
        let flag: boolean = true;
        endpoints.forEach(endpoint => {
            if (endpoint.name === match ||
                (endpoint.url === match && endpoint.type === req.body.type)) {
                entity = endpoint;
                flag = false;
            }
        });
        if (flag) {
            res.send(500);
            return;
        }
        if (entity.user.id !== getUserID(req.headers.authorization)) {
            res.send(403);
            return;
        }
        res.send(await monitoringResultService.create(entity));
    }

    private async remove(req: Request, res: Response): Promise<void> {
        try {
            res.send( await monitoringResultService.delete(req.params.id, getUserID(req.headers.authorization)));
        } catch (e) {
            res.send(500);
        }
    }
}
