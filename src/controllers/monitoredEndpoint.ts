import {Controller} from "./controller";
import {HttpServer} from "../server/httpServer";
import {Request, Response} from "restify";
import { monitoredEndpointService } from "../services/monitoredEndpoint";

export class MonitoredEndpointController implements Controller {
    public initialize(httpServer: HttpServer): void {
        httpServer.get("endpoints", this.list.bind(this));
        httpServer.get("endpoint/:id", this.getById.bind(this));
        httpServer.post("endpoint", this.create.bind(this));
        httpServer.put("endpoint/:id", this.update.bind(this));
        httpServer.del("endpoint/:id", this.remove.bind(this));
    }

    private async list(req: Request, res: Response): Promise<void> {
        res.send(await monitoredEndpointService.list());
    }

    private async getById(req: Request, res: Response): Promise<void> {
        const entity = await monitoredEndpointService.getById(req.params.id);
        res.send(entity ? 200 : 404, entity);
    }

    private async create(req: Request, res: Response): Promise<void> {
        const entity = await monitoredEndpointService.create(req.body);
        res.send(entity ? 200 : 404, entity);
    }

    private async update(req: Request, res: Response): Promise<void> {
        res.send(await monitoredEndpointService.update({...req.body, id: req.params.id}));
    }

    private async remove(req: Request, res: Response): Promise<void> {
        try {
            await monitoredEndpointService.delete(req.params.id);
            res.send(200);
        } catch (e) {
            res.send(500);
        }
    }
}
