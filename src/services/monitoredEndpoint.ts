import { MonitoredEndpoint } from "../entity/MonitoredEndpoint";
import { getRepository, DeleteResult } from "typeorm";
import { User } from "../entity/User";

export class MonitoredEndpointService {

    public async list(userID: number): Promise<MonitoredEndpoint[]> {
        const endpoints = await getRepository(MonitoredEndpoint).find();
        const returnEndpoints: MonitoredEndpoint[] = [];
        endpoints.forEach((endpoint) => {
            if (endpoint.user.id === userID) {
                returnEndpoints.push(endpoint);
            }
        });
        return returnEndpoints;
    }

    public async getById(id: number, userID: number): Promise<[number, MonitoredEndpoint]> {
        const entity = await getRepository(MonitoredEndpoint).findOne(id);
        if ( (! entity) || (entity.user.id !== userID) ) {
            return [404, entity];
        }
        return [200, entity];
    }

    public async create(entity: MonitoredEndpoint, userID: number): Promise<MonitoredEndpoint> {
        // Normally DTO !== DB-Entity, so we "simulate" a mapping of both
        if (entity.name === "" || entity.url === "") {
            return null;
        }
        const newEndpoint = new MonitoredEndpoint();
        newEndpoint.name = entity.name;
        newEndpoint.url = entity.url;
        newEndpoint.user = await getRepository(User).findOne(userID);
        const save = await getRepository(MonitoredEndpoint).save(newEndpoint)
        console.log(await getRepository(MonitoredEndpoint).findOne(newEndpoint.id));
        return save;
    }

    public async update(entity: MonitoredEndpoint, userID: number): Promise<[number, MonitoredEndpoint]> {
        const updatedEntity = await getRepository(MonitoredEndpoint).findOne(entity.id);
        if ( (! entity) || (updatedEntity.user.id !== userID) ) {
            return [404, updatedEntity];
        }
        if (entity.name) {
            updatedEntity.name = entity.name;
        }
        if (entity.url) {
            updatedEntity.url = entity.url;
        }
        if (entity.type) {
            updatedEntity.type = entity.type;
        }
        await getRepository(MonitoredEndpoint).save(updatedEntity);
        return [200, updatedEntity];
    }

    public async delete(id: number, userID: number): Promise<number> {
        const entity = await getRepository(MonitoredEndpoint).findOne(id);
        if (entity.user.id !== userID) {
            return 404;
        }
        await getRepository(MonitoredEndpoint).delete(id);
        return 200;
    }
}

export const endpointService = new MonitoredEndpointService();
