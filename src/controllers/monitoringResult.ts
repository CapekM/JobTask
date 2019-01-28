import {Controller} from './controller';
import {HttpServer} from '../server/httpServer';
import {Request, Response} from 'restify';
import { getRepository } from 'typeorm';
import { MonitoredEndpoint } from '../entity/MonitoredEndpoint';
import { monitoringResultService } from '../services/monitoringResult';

export class MonitoreingResultController implements Controller {
    public initialize(httpServer: HttpServer): void {
        httpServer.get('results', this.list.bind(this));
        httpServer.get('result/:id', this.getById.bind(this));
        httpServer.post('result', this.create.bind(this));
        httpServer.del('result/:id', this.remove.bind(this));
    }

    private async list(req: Request, res: Response): Promise<void> {
        res.send(await monitoringResultService.list());
    }

    private async getById(req: Request, res: Response): Promise<void> {
        const entity = await monitoringResultService.getById(req.params.id);
        res.send(entity ? 200 : 404, entity);
    }

    private async create(req: Request, res: Response): Promise<void> {
        const match: string = (typeof req.body.url !== 'undefined' && req.body.url)
        ? req.body.url : req.body.name;
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
        res.send(await monitoringResultService.create(entity));
    }

    private async remove(req: Request, res: Response): Promise<void> {
        try {
            await monitoringResultService.delete(req.params.id);
            res.send(200);
        } catch (e) {
            res.send(500);
        }
    }
}
