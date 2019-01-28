import {HttpServer} from './httpServer';
import * as restify from 'restify';
// tslint:disable-next-line: no-duplicate-imports
import {RequestHandler, Server} from 'restify';
import {CONTROLLERS} from '../controllers/index';

export class ApiServer implements HttpServer {
    private restify: Server;

    public get(url: string, requestHandler: RequestHandler): void {
        this.addRoute('get', url, requestHandler);
    }

    public post(url: string, requestHandler: RequestHandler): void {
        this.addRoute('post', url, requestHandler);
    }

    public del(url: string, requestHandler: RequestHandler): void {
        this.addRoute('del', url, requestHandler);
    }

    public put(url: string, requestHandler: RequestHandler): void {
        this.addRoute('put', url, requestHandler);
    }

    public start(port: number): void {
        this.restify = restify.createServer();
        this.restify.use(restify.plugins.queryParser());
        this.restify.use(restify.plugins.bodyParser());

        this.addControllers();

        this.restify.listen(port, () => console.log(`Server is up & running on port ${port}`));
    }

// tslint:disable-next-line: max-line-length
    private addRoute(method: 'get' | 'post' | 'put' | 'del', url: string, requestHandler: RequestHandler): void {
        this.restify[method](url, async (req, res, next) => {
            try {
                await requestHandler(req, res, next);
            } catch (e) {
                console.log(e);
                res.send(500, e);
            }
        });
        console.log(`Added route ${method.toUpperCase()} ${url}`);
    }

    private addControllers(): void {
        CONTROLLERS.forEach(controller => controller.initialize(this));
    }
}
