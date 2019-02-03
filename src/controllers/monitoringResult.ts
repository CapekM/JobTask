import { Controller } from "./controller";
import { HttpServer } from "../server/httpServer";
import { Request, Response } from "restify";
import { monitoringResultService } from "../services/monitoringResult";
import { getUserID } from "../services/auth";

export class MonitoringResultController implements Controller {
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
        res.send(await monitoringResultService.getByName(req.params.name, getUserID(req.headers.authorization)));
    }

    private async create(req: Request, res: Response): Promise<void> {
        res.send(await monitoringResultService.create(req, getUserID(req.headers.authorization)));
    }

    private async remove(req: Request, res: Response): Promise<void> {
        res.send(await monitoringResultService.delete(req.params.id, getUserID(req.headers.authorization)));
    }
}
