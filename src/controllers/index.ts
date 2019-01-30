import { HelpController } from "./helpController";
import { MonitoredEndpointController } from "./monitoredEndpoint";
import { MonitoreingResultController } from "./monitoringResult";

export const CONTROLLERS = [
    new MonitoreingResultController(),
    new MonitoredEndpointController(),
    new HelpController(),
];
