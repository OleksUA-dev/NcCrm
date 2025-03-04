// modules/low-code-platform/metadata-service/src/services/field.service.ts

import { Document } from 'mongoose';
import { Field } from '../models';
import { IField } from '../models/field.model';
import {
    CreateFieldDto,
    UpdateFieldDto,
    QueryParams,
    PaginatedResponse,
    IFieldService,
    IKafkaService
} from '../interfaces';

export class FieldService implements IFieldService {
    private kafkaService: IKafkaService;

    constructor(kafkaService: IKafkaService) {
        this.kafkaService = kafkaService;
    }

    /**
     * Створення нового поля
     */
    async createField(dto: CreateFieldDto): Promise<Document & IField> {
        try {
            // Отримання найбільшого поточного order для встановлення правильного порядку
            if (dto.order === undefined) {
                const maxOrderField = await Field.findOne({ entityId: dto.entityId })
                    .sort({ order: -1 })
                    .limit(1);

                dto.order = maxOrderField ? maxOrderField.order + 1 : 0;
            }

            // Створення поля
            const field = new Field(dto);
            await field.save();

            // Публікація події в Kafka
            await this.kafkaService.publishFieldCreated(field);

            return field;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Отримання поля за ID
     */
    async getField(id: string): Promise<Document & IField | null> {
        try {
            const field = await Field.findById(id);
            return field;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Отримання списку полів з пагінацією та фільтрацією
     */
    async getFields(queryParams: QueryParams): Promise<PaginatedResponse<Document & IField>> {
        try {
            const { page = 1, limit = 50, sort = 'order', filter, populate } = queryParams;
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
            const total = await Field.countDocuments(query);
            let fieldsQuery = Field.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit);

            // Додавання populate якщо потрібно
            if (populate) {
                const populateFields = populate.split(',');
                populateFields.forEach(field => {
                    fieldsQuery = fieldsQuery.populate(field.trim());
                });
            }

            const fields = await fieldsQuery;

            return {
                data: fields,
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
     * Отримання полів сутності
     */
    async getFieldsByEntity(entityId: string, queryParams: QueryParams): Promise<PaginatedResponse<Document & IField>> {
        try {
            queryParams.filter = JSON.stringify({
                ...JSON.parse(queryParams.filter || '{}'),
                entityId
            });

            return this.getFields(queryParams);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Оновлення поля
     */
    async updateField(id: string, dto: UpdateFieldDto): Promise<Document & IField | null> {
        try {
            const field = await Field.findByIdAndUpdate(id, dto, { new: true });

            if (field) {
                // Публікація події в Kafka
                await this.kafkaService.publishFieldUpdated(field);
            }

            return field;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Видалення поля
     */
    async deleteField(id: string): Promise<Document & IField | null> {
        try {
            const field = await Field.findByIdAndDelete(id);

            if (field) {
                // Публікація події в Kafka
                await this.kafkaService.publishFieldDeleted(field);
            }

            return field;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Перевірка унікальності імені поля в рамках сутності
     */
    async validateFieldName(entityId: string, name: string): Promise<boolean> {
        try {
            const count = await Field.countDocuments({ entityId, name });
            return count === 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Зміна порядку полів
     */
    async reorderFields(entityId: string, fieldIds: string[]): Promise<(Document & IField)[]> {
        try {
            const updates = fieldIds.map((id, index) => {
                return Field.findOneAndUpdate(
                    { _id: id, entityId },
                    { order: index },
                    { new: true }
                );
            });

            const updatedFields = await Promise.all(updates);
            return updatedFields.filter(field => field !== null) as (Document & IField)[];
        } catch (error) {
            throw error;
        }
    }
}