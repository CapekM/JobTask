import { HttpServer } from "../server/httpServer";
import { HelpController } from "./helpController";
import { MonitoredEndpointController } from "./monitoredEndpoint";
import { MonitoreingResultController } from "./monitoringResult";

export interface Controller {
    initialize(httpServer: HttpServer): void;
}

export const controllers = [
    new MonitoreingResultController(),
    new MonitoredEndpointController(),
    new HelpController(),
];
