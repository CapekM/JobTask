import { MonitoredEndpoint } from "../entity/MonitoredEndpoint";
import { getRepository, DeleteResult } from "typeorm";

export class MonitoredEndpointService {

    public async list(): Promise<MonitoredEndpoint[]> {
        return getRepository(MonitoredEndpoint).find();
    }

    public async getById(id: number): Promise<MonitoredEndpoint> {
        return getRepository(MonitoredEndpoint).findOne(id);
    }

    public async create(entity: MonitoredEndpoint): Promise<MonitoredEndpoint> {
        // Normally DTO !== DB-Entity, so we "simulate" a mapping of both
        if (entity.name === "" || entity.url === "") {
            return null;
        }
        const newEndpoint = new MonitoredEndpoint();
        newEndpoint.name = entity.name;
        newEndpoint.url = entity.url;
        return getRepository(MonitoredEndpoint).save(newEndpoint);
    }

    public async update(entity: MonitoredEndpoint): Promise<MonitoredEndpoint> {
        const updatedEntity = await getRepository(MonitoredEndpoint).findOne(entity.id);
        if (entity.name) {
            updatedEntity.name = entity.name;
        }
        if (entity.url) {
            updatedEntity.url = entity.url;
        }
        if (entity.type) {
            updatedEntity.type = entity.type;
        }
        return getRepository(MonitoredEndpoint).save(updatedEntity);
    }

    public async delete(id: number): Promise<DeleteResult> {
        return getRepository(MonitoredEndpoint).delete(id);
    }
}

export const monitoredEndpointService = new MonitoredEndpointService();
