// modules/low-code-platform/dynamic-data-service/src/services/kafka-handler.service.ts

import { IKafkaHandler, IModelManager } from '../interfaces';
import winston from 'winston';

export class KafkaHandler implements IKafkaHandler {
    private modelManager: IModelManager;
    private logger: winston.Logger;

    constructor(modelManager: IModelManager, logger: winston.Logger) {
        this.modelManager = modelManager;
        this.logger = logger;
    }

    /**
     * Обробка події створення сутності
     */
    async handleEntityCreated(payload: any): Promise<void> {
        try {
            this.logger.info(`Обробка події створення сутності:`, payload);

            const { id, name, tableName } = payload;

            // Створення моделі для нової сутності
            await this.modelManager.createEntityModel(name, tableName);

            this.logger.info(`Успішно створено модель для сутності ${name}`);
        } catch (error) {
            this.logger.error(`Помилка при обробці події створення сутності:`, error);
            throw error;
        }
    }

    /**
     * Обробка події оновлення сутності
     */
    async handleEntityUpdated(payload: any): Promise<void> {
        try {
            this.logger.info(`Обробка події оновлення сутності:`, payload);

            const { id, name, tableName } = payload;

            // Оновлення моделі сутності
            await this.modelManager.updateEntityModel(name, tableName);

            this.logger.info(`Успішно оновлено модель для сутності ${name}`);
        } catch (error) {
            this.logger.error(`Помилка при обробці події оновлення сутності:`, error);
            throw error;
        }
    }

    /**
     * Обробка події видалення сутності
     */
    async handleEntityDeleted(payload: any): Promise<void> {
        try {
            this.logger.info(`Обробка події видалення сутності:`, payload);

            const { id, name } = payload;

            // Видалення моделі сутності
            await this.modelManager.deleteEntityModel(name);

            this.logger.info(`Успішно видалено модель для сутності ${name}`);
        } catch (error) {
            this.logger.error(`Помилка при обробці події видалення сутності:`, error);
            throw error;
        }
    }

    /**
     * Обробка події створення поля
     */
    async handleFieldCreated(payload: any): Promise<void> {
        try {
            this.logger.info(`Обробка події створення поля:`, payload);

            const { id, entityId, name, type, isRequired } = payload;

            // Отримуємо інформацію про сутність
            // У реальному додатку, потрібно буде зробити запит до сервісу метаданих
            // Для спрощення, вважаємо що ми маємо ім'я сутності з поля entityId

            // Додавання поля до моделі
            await this.modelManager.addField(entityId, name, type, isRequired || false);

            this.logger.info(`Успішно додано поле ${name} до моделі для сутності ${entityId}`);
        } catch (error) {
            this.logger.error(`Помилка при обробці події створення поля:`, error);
            throw error;
        }
    }

    /**
     * Обробка події оновлення поля
     */
    async handleFieldUpdated(payload: any): Promise<void> {
        try {
            this.logger.info(`Обробка події оновлення поля:`, payload);

            const { id, entityId, name, type, isRequired } = payload;

            // Оновлення поля в моделі
            await this.modelManager.updateField(entityId, name, type, isRequired || false);

            this.logger.info(`Успішно оновлено поле ${name} в моделі для сутності ${entityId}`);
        } catch (error) {
            this.logger.error(`Помилка при обробці події оновлення поля:`, error);
            throw error;
        }
    }

    /**
     * Обробка події видалення поля
     */
    async handleFieldDeleted(payload: any): Promise<void> {
        try {
            this.logger.info(`Обробка події видалення поля:`, payload);

            const { id, entityId, name } = payload;

            // Видалення поля з моделі
            await this.modelManager.deleteField(entityId, name);

            this.logger.info(`Успішно видалено поле ${name} з моделі для сутності ${entityId}`);
        } catch (error) {
            this.logger.error(`Помилка при обробці події видалення поля:`, error);
            throw error;
        }
    }
}