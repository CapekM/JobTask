import { MonitoredEndpoint } from "../entity/MonitoredEndpoint";
import { getRepository, DeleteResult } from "typeorm";
import { User } from "../entity/User";

const errors = require("restify-errors");

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
            throw new errors.NotFoundError();
        }
        if (entity.user.id !== userID) {
            throw new errors.ForbiddenError();
        }
        return entity;
    }

    public async create(entity: MonitoredEndpoint, userID: number): Promise<MonitoredEndpoint> {
        // Normally DTO !== DB-Entity, so we "simulate" a mapping of both
        if (entity.name === "" || entity.url === "") {
            throw new errors.BadRequestError();
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
            throw new errors.BadRequestError();
        }
        if (! updatedEntity) {
            throw new errors.NotFoundError();
        }
        if (updatedEntity.user.id !== userID) {
            throw new errors.ForbiddenError();
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
        return getRepository(MonitoredEndpoint).save(updatedEntity);
    }

    public async delete(id: number, userID: number): Promise<DeleteResult> {
        const entity = await getRepository(MonitoredEndpoint).findOne(id);
        if (! entity) {
            throw new errors.NotFoundError();
        }
        if (entity.user.id !== userID) {
            throw new errors.ForbiddenError();
        }
        return getRepository(MonitoredEndpoint).delete(id);
    }
}

export const endpointService = new MonitoredEndpointService();
