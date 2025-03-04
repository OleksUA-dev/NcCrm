// modules/low-code-platform/dynamic-data-service/src/services/dynamic-data.service.ts

import { Document } from 'mongoose';
import { IDynamicData } from '../models/dynamic-data.model';
import { IDynamicDataService, IModelManager, PaginatedResponse, QueryParams } from '../interfaces';
import winston from 'winston';

export class DynamicDataService implements IDynamicDataService {
    private modelManager: IModelManager;
    private logger: winston.Logger;

    constructor(modelManager: IModelManager, logger: winston.Logger) {
        this.modelManager = modelManager;
        this.logger = logger;
    }

    /**
     * Створення нового запису даних
     */
    async createRecord(entityName: string, data: Record<string, any>, userId?: string): Promise<Document & IDynamicData> {
        try {
            // Отримання моделі сутності
            const model = await this.modelManager.getEntityModel(entityName);

            // Валідація даних
            const validation = await this.validateData(entityName, data);
            if (!validation.isValid) {
                throw new Error(`Помилка валідації даних: ${JSON.stringify(validation.errors)}`);
            }

            // Створення запису
            const record = new model({
                entityId: entityName,
                data,
                createdBy: userId,
                updatedBy: userId
            });

            await record.save();

            this.logger.info(`Створено запис для сутності ${entityName} з ID ${record._id}`);
            return record;
        } catch (error) {
            this.logger.error(`Помилка при створенні запису для сутності ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Отримання запису за ID
     */
    async getRecord(entityName: string, recordId: string): Promise<Document & IDynamicData | null> {
        try {
            // Отримання моделі сутності
            const model = await this.modelManager.getEntityModel(entityName);

            // Пошук запису
            const record = await model.findById(recordId);

            return record;
        } catch (error) {
            this.logger.error(`Помилка при отриманні запису ${recordId} для сутності ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Отримання списку записів з пагінацією та фільтрацією
     */
    async getRecords(entityName: string, queryParams: QueryParams): Promise<PaginatedResponse<Document & IDynamicData>> {
        try {
            // Отримання моделі сутності
            const model = await this.modelManager.getEntityModel(entityName);

            const { page = 1, limit = 20, sort = '-createdAt', filter, fields } = queryParams;
            const skip = (page - 1) * limit;

            // Створення умов фільтрації
            let query: any = {};

            if (filter) {
                try {
                    const filterObj = JSON.parse(filter);
                    // Перетворення фільтрів для data полів
                    Object.keys(filterObj).forEach(key => {
                        if (key !== 'entityId' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'createdBy' && key !== 'updatedBy') {
                            query[`data.${key}`] = filterObj[key];
                            delete filterObj[key];
                        }
                    });
                    query = { ...query, ...filterObj };
                } catch (e) {
                    // Ігнорування помилки парсингу фільтра
                }
            }

            // Селект полів
            let projection: any = {};
            if (fields) {
                const fieldList = fields.split(',');
                fieldList.forEach(field => {
                    projection[field.trim()] = 1;
                });
            }

            // Виконання запиту з пагінацією
            const total = await model.countDocuments(query);
            const records = await model.find(query, projection)
                .sort(sort)
                .skip(skip)
                .limit(limit);

            return {
                data: records,
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            };
        } catch (error) {
            this.logger.error(`Помилка при отриманні записів для сутності ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Оновлення запису
     */
    async updateRecord(entityName: string, recordId: string, data: Record<string, any>, userId?: string): Promise<Document & IDynamicData | null> {
        try {
            // Отримання моделі сутності
            const model = await this.modelManager.getEntityModel(entityName);

            // Валідація даних
            const validation = await this.validateData(entityName, data);
            if (!validation.isValid) {
                throw new Error(`Помилка валідації даних: ${JSON.stringify(validation.errors)}`);
            }

            // Оновлення запису
            const record = await model.findByIdAndUpdate(
                recordId,
                {
                    data,
                    updatedBy: userId
                },
                { new: true }
            );

            if (record) {
                this.logger.info(`Оновлено запис ${recordId} для сутності ${entityName}`);
            }

            return record;
        } catch (error) {
            this.logger.error(`Помилка при оновленні запису ${recordId} для сутності ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Видалення запису
     */
    async deleteRecord(entityName: string, recordId: string): Promise<Document & IDynamicData | null> {
        try {
            // Отримання моделі сутності
            const model = await this.modelManager.getEntityModel(entityName);

            // Видалення запису
            const record = await model.findByIdAndDelete(recordId);

            if (record) {
                this.logger.info(`Видалено запис ${recordId} для сутності ${entityName}`);
            }

            return record;
        } catch (error) {
            this.logger.error(`Помилка при видаленні запису ${recordId} для сутності ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Валідація даних
     */
    async validateData(entityName: string, data: Record<string, any>): Promise<{ isValid: boolean; errors?: Record<string, string> }> {
        // У реальному додатку тут буде логіка валідації на основі метаданих полів
        // Наприклад, перевірка типів, обов'язкових полів, унікальності тощо

        // Для MVP, повертаємо true
        return { isValid: true };
    }
}