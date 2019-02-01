import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";
import { Request, Response } from "restify";
import { endpointService } from "../services/monitoredEndpoint";
import { getUserID } from "../services/auth";
require("dotenv").config();

export class MonitoredEndpointController implements Controller {
    public initialize(httpServer: HttpServer): void {
        httpServer.get("endpoints", this.list.bind(this));
        httpServer.get("endpoint/:id", this.getById.bind(this));
        httpServer.post("endpoint", this.create.bind(this));
        httpServer.put("endpoint/:id", this.update.bind(this));
        httpServer.del("endpoint/:id", this.remove.bind(this));
    }

    private async list(req: Request, res: Response): Promise<void> {
        res.send(await endpointService.list(getUserID(req.headers.authorization)));
    }

    private async getById(req: Request, res: Response): Promise<void> {
        const message = await endpointService.getById(req.params.id, getUserID(req.headers.authorization));
        res.send(message[0], (message[0] === 200) ? message[1] : "");
    }

    private async create(req: Request, res: Response): Promise<void> {
        const entity = await endpointService.create(req.body, getUserID(req.headers.authorization));
        res.send(entity ? 200 : 404, entity);
    }

    private async update(req: Request, res: Response): Promise<void> {
        const message = await endpointService.update({ ...req.body, id: req.params.id }, getUserID(req.headers.authorization))
        res.send(message[0], (message[0] === 200) ? message[1] : "");
    }

    private async remove(req: Request, res: Response): Promise<void> {
        try {
            res.send(await endpointService.delete(req.params.id, getUserID(req.headers.authorization)));
        } catch (e) {
            res.send(500);
        }
    }
}
