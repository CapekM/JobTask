import { HttpServer } from "../server/httpServer";
import { HelpController } from "./helpController";
import { MonitoredEndpointController } from "./monitoredEndpoint";
import { MonitoringResultController } from "./monitoringResult";

export interface Controller {
    initialize(httpServer: HttpServer): void;
}

export const controllers = [
    new MonitoringResultController(),
    new MonitoredEndpointController(),
    new HelpController(),
];
