// modules/low-code-platform/metadata-service/src/services/kafka.service.ts

import { Document } from 'mongoose';
import { Producer } from 'kafkajs';
import { IEntity } from '../models/entity.model';
import { IField } from '../models/field.model';
import { IKafkaService } from '../interfaces';
import winston from 'winston';

export class KafkaService implements IKafkaService {
    private producer: Producer;
    private logger: winston.Logger;

    constructor(producer: Producer, logger: winston.Logger) {
        this.producer = producer;
        this.logger = logger;
    }

    /**
     * Публікація події створення сутності
     */
    async publishEntityCreated(entity: Document & IEntity): Promise<void> {
        await this.publishEvent('entity-created', {
            id: entity._id,
            name: entity.name,
            displayName: entity.displayName,
            tableName: entity.tableName,
            isSystem: entity.isSystem,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Публікація події оновлення сутності
     */
    async publishEntityUpdated(entity: Document & IEntity): Promise<void> {
        await this.publishEvent('entity-updated', {
            id: entity._id,
            name: entity.name,
            displayName: entity.displayName,
            tableName: entity.tableName,
            isSystem: entity.isSystem,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Публікація події видалення сутності
     */
    async publishEntityDeleted(entity: Document & IEntity): Promise<void> {
        await this.publishEvent('entity-deleted', {
            id: entity._id,
            name: entity.name,
            tableName: entity.tableName,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Публікація події створення поля
     */
    async publishFieldCreated(field: Document & IField): Promise<void> {
        await this.publishEvent('field-created', {
            id: field._id,
            entityId: field.entityId,
            name: field.name,
            displayName: field.displayName,
            type: field.type,
            isRequired: field.isRequired,
            isSystem: field.isSystem,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Публікація події оновлення поля
     */
    async publishFieldUpdated(field: Document & IField): Promise<void> {
        await this.publishEvent('field-updated', {
            id: field._id,
            entityId: field.entityId,
            name: field.name,
            displayName: field.displayName,
            type: field.type,
            isRequired: field.isRequired,
            isSystem: field.isSystem,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Публікація події видалення поля
     */
    async publishFieldDeleted(field: Document & IField): Promise<void> {
        await this.publishEvent('field-deleted', {
            id: field._id,
            entityId: field.entityId,
            name: field.name,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Публікація події в Kafka
     */
    private async publishEvent(topic: string, payload: any): Promise<void> {
        try {
            await this.producer.send({
                topic,
                messages: [
                    {
                        value: JSON.stringify(payload)
                    }
                ]
            });

            this.logger.info(`Подію ${topic} опубліковано:`, payload);
        } catch (error) {
            this.logger.error(`Помилка публікації події ${topic}:`, error);
            throw error;
        }
    }
}