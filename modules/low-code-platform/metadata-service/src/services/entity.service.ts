// modules/low-code-platform/metadata-service/src/services/entity.service.ts

import { Document } from 'mongoose';
import { Entity } from '../models';
import { IEntity } from '../models/entity.model';
import {
    CreateEntityDto,
    UpdateEntityDto,
    QueryParams,
    PaginatedResponse,
    IEntityService,
    IKafkaService
} from '../interfaces';

export class EntityService implements IEntityService {
    private kafkaService: IKafkaService;

    constructor(kafkaService: IKafkaService) {
        this.kafkaService = kafkaService;
    }

    /**
     * Створення нової сутності
     */
    async createEntity(dto: CreateEntityDto): Promise<Document & IEntity> {
        try {
            // Генерація tableName, якщо не вказано
            if (!dto.tableName) {
                dto.tableName = await this.generateTableName(dto.name);
            }

            // Створення сутності
            const entity = new Entity(dto);
            await entity.save();

            // Публікація події в Kafka
            await this.kafkaService.publishEntityCreated(entity);

            return entity;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Отримання сутності за ID
     */
    async getEntity(id: string): Promise<Document & IEntity | null> {
        try {
            const entity = await Entity.findById(id);
            return entity;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Отримання списку сутностей з пагінацією та фільтрацією
     */
    async getEntities(queryParams: QueryParams): Promise<PaginatedResponse<Document & IEntity>> {
        try {
            const { page = 1, limit = 20, sort = '-createdAt', filter } = queryParams;
            const skip = (page - 1) * limit;

            // Створення умов фільтрації
            let query: any = {};

            if (filter) {
                try {
                    const filterObj = JSON.parse(filter);
                    query = { ...query, ...filterObj };
                } catch (e) {
                    // Ігнорування помилки парсингу фільтра
                }
            }

            // Виконання запиту з пагінацією
            const total = await Entity.countDocuments(query);
            const entities = await Entity.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit);

            return {
                data: entities,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Оновлення сутності
     */
    async updateEntity(id: string, dto: UpdateEntityDto): Promise<Document & IEntity | null> {
        try {
            const entity = await Entity.findByIdAndUpdate(id, dto, { new: true });

            if (entity) {
                // Публікація події в Kafka
                await this.kafkaService.publishEntityUpdated(entity);
            }

            return entity;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Видалення сутності
     */
    async deleteEntity(id: string): Promise<Document & IEntity | null> {
        try {
            const entity = await Entity.findByIdAndDelete(id);

            if (entity) {
                // Публікація події в Kafka
                await this.kafkaService.publishEntityDeleted(entity);
            }

            return entity;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Перевірка унікальності імені сутності
     */
    async validateEntityName(name: string): Promise<boolean> {
        try {
            const count = await Entity.countDocuments({ name });
            return count === 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Генерація імені таблиці з імені сутності
     */
    async generateTableName(name: string): Promise<string> {
        // Перетворення camelCase на snake_case
        const tableName = name
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .toLowerCase();

        // Перевірка унікальності
        const existingEntity = await Entity.findOne({ tableName });

        if (existingEntity) {
            // Якщо таке ім'я вже існує, додаємо унікальний суфікс
            const timestamp = Date.now().toString().slice(-4);
            return `${tableName}_${timestamp}`;
        }

        return tableName;
    }
}