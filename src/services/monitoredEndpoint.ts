import { MonitoredEndpoint } from "../entity/MonitoredEndpoint";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

const errors = require('restify-errors');

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

    public async getById(id: number, userID: number): Promise<MonitoredEndpoint> {
        const entity = await getRepository(MonitoredEndpoint).findOne(id);
        if (! entity) {
            return new errors.NotFoundError();
        }
        if (entity.user.id !== userID) {
            return new errors.ForbiddenError();
        }
        return entity;
    }

    public async create(entity: MonitoredEndpoint, userID: number): Promise<MonitoredEndpoint> {
        // Normally DTO !== DB-Entity, so we "simulate" a mapping of both
        if (entity.name === "" || entity.url === "") {
            return new errors.BadRequestError();
        }
        const newEndpoint = new MonitoredEndpoint();
        newEndpoint.name = entity.name;
        newEndpoint.url = entity.url;
        newEndpoint.user = await getRepository(User).findOne(userID);
        return getRepository(MonitoredEndpoint).save(newEndpoint);
    }

    public async update(entity: MonitoredEndpoint, userID: number): Promise<MonitoredEndpoint> {
        const updatedEntity = await getRepository(MonitoredEndpoint).findOne(entity.id);
        if (! entity) {
            return new errors.BadRequestError();
        }
        if (! updatedEntity) {
            return new errors.NotFoundError();
        }
        if (updatedEntity.user.id !== userID) {
            return new errors.ForbiddenError();
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
        return updatedEntity;
    }

    public async delete(id: number, userID: number): Promise<number> {
        const entity = await getRepository(MonitoredEndpoint).findOne(id);
        if (! entity) {
            return new errors.NotFoundError();
        }
        if (entity.user.id !== userID) {
            return new errors.ForbiddenError();
        }
        await getRepository(MonitoredEndpoint).delete(id);
        return 200;
    }
}

export const endpointService = new MonitoredEndpointService();
