import {Controller} from "./controller";
import {HttpServer} from "../server/httpServer";
import {Request, Response} from "restify";
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
        const message = await monitoringResultService.create(req, getUserID(req.headers.authorization));
        res.send( (message[0] !== 200) ? message[0] : message[0], message[1]);
    }

    private async remove(req: Request, res: Response): Promise<void> {
        try {
            res.send( await monitoringResultService.delete(req.params.id, getUserID(req.headers.authorization)));
        } catch (e) {
            res.send(500);
        }
    }
}
