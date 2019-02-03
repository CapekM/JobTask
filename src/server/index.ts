import { HttpServer } from "./httpServer";
import * as restify from "restify";
// tslint:disable-next-line: no-duplicate-imports
import { RequestHandler, Server } from "restify";
import { controllers } from "../controllers/controller";
import * as rjwt from "restify-jwt-community";

export class ApiServer implements HttpServer {
    public server: Server;

    public get(url: string, requestHandler: RequestHandler): void {
        this.addRoute("get", url, requestHandler);
    }

    public post(url: string, requestHandler: RequestHandler): void {
        this.addRoute("post", url, requestHandler);
    }

    public del(url: string, requestHandler: RequestHandler): void {
        this.addRoute("del", url, requestHandler);
    }

    public put(url: string, requestHandler: RequestHandler): void {
        this.addRoute("put", url, requestHandler);
    }

    public start(port: number): void {
        this.server = restify.createServer();
        this.server.use(restify.plugins.queryParser());
        this.server.use(restify.plugins.bodyParser());
        this.server.use(restify.plugins.authorizationParser());
        this.server.use(rjwt({ secret: process.env.JWT_SECRET }).unless({ path: ["/auth", "/ping"] }));
        this.addControllers();

        this.server.listen(port);
        console.log(`Server is up & running on port ${port}`);
    }

    private addRoute(method: "get" | "post" | "put" | "del", url: string, requestHandler: RequestHandler): void {
        this.server[method](url, async (req, res, next) => {
            try {
                await requestHandler(req, res, next);
            } catch (e) {
                res.send(e);
            }
        });
        // console.log(`Added route ${method.toUpperCase()} ${url}`);
    }

    private addControllers(): void {
        controllers.forEach(controller => controller.initialize(this));
    }
}
