import {PingController} from './ping';
import { MonitoredEndpointController } from './monitoredEndpoint';
import { MonitoreingResultController } from './monitoringResult';

export const CONTROLLERS = [
    new MonitoreingResultController(),
    new MonitoredEndpointController(),
    new PingController(),
];
