// modules/low-code-platform/dynamic-data-service/src/services/model-manager.service.ts

import mongoose from 'mongoose';
import { createDynamicDataModel } from '../models/dynamic-data.model';
import { IModelManager } from '../interfaces';
import winston from 'winston';

export class ModelManager implements IModelManager {
    private models: Map<string, mongoose.Model<any>>;
    private logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.models = new Map();
        this.logger = logger;
    }

    /**
     * Створення моделі для нової сутності
     */
    async createEntityModel(entityName: string, tableName: string): Promise<void> {
        try {
            if (this.models.has(entityName)) {
                this.logger.warn(`Модель для сутності ${entityName} вже існує`);
                return;
            }

            const model = createDynamicDataModel(entityName, tableName);
            this.models.set(entityName, model);
            this.logger.info(`Створено модель для сутності ${entityName} з таблицею ${tableName}`);
        } catch (error) {
            this.logger.error(`Помилка при створенні моделі для сутності ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Оновлення моделі сутності
     */
    async updateEntityModel(entityName: string, tableName: string): Promise<void> {
        try {
            // В MongoDB неможливо змінити ім'я колекції без перенесення даних
            // Тому створюємо нову модель і позначаємо стару як застарілу
            if (this.models.has(entityName)) {
                const oldModel = this.models.get(entityName);

                // Потрібно перенести дані зі старої колекції в нову
                // Це складний процес, який може потребувати додаткової логіки

                // Створюємо нову модель з новим іменем таблиці
                const newModel = createDynamicDataModel(entityName, tableName);
                this.models.set(entityName, newModel);

                this.logger.info(`Оновлено модель для сутності ${entityName} з таблицею ${tableName}`);
            } else {
                await this.createEntityModel(entityName, tableName);
            }
        } catch (error) {
            this.logger.error(`Помилка при оновленні моделі для сутності ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Видалення моделі сутності
     */
    async deleteEntityModel(entityName: string): Promise<void> {
        try {
            if (this.models.has(entityName)) {
                // Видалення колекції
                const model = this.models.get(entityName);
                await mongoose.connection.dropCollection(model.collection.name);

                // Видалення моделі з кеша
                this.models.delete(entityName);

                this.logger.info(`Видалено модель для сутності ${entityName}`);
            } else {
                this.logger.warn(`Модель для сутності ${entityName} не знайдена`);
            }
        } catch (error) {
            this.logger.error(`Помилка при видаленні моделі для сутності ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Отримання моделі сутності
     */
    async getEntityModel(entityName: string): Promise<mongoose.Model<any>> {
        if (!this.models.has(entityName)) {
            throw new Error(`Модель для сутності ${entityName} не знайдена`);
        }

        return this.models.get(entityName)!;
    }

    /**
     * Додавання нового поля до моделі
     * Примітка: В MongoDB схеми є гнучкими, тому ми не потребуємо змінювати схему
     * Однак, ми можемо додавати валідації та індекси
     */
    async addField(entityName: string, fieldName: string, fieldType: string, required: boolean): Promise<void> {
        try {
            // В MongoDB не потрібно змінювати схему для додавання полів
            // Але ми можемо додати індекс для нового поля для оптимізації пошуку
            if (this.models.has(entityName)) {
                const model = this.models.get(entityName)!;
                await model.collection.createIndex({ [`data.${fieldName}`]: 1 });

                this.logger.info(`Додано поле ${fieldName} до моделі ${entityName} з індексом`);
            } else {
                this.logger.warn(`Модель для сутності ${entityName} не знайдена`);
            }
        } catch (error) {
            this.logger.error(`Помилка при додаванні поля ${fieldName} до моделі ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Оновлення поля в моделі
     */
    async updateField(entityName: string, fieldName: string, fieldType: string, required: boolean): Promise<void> {
        // В MongoDB не потрібно змінювати схему для оновлення типу поля
        // Але можемо оновити індекс
        try {
            if (this.models.has(entityName)) {
                const model = this.models.get(entityName)!;

                // Спочатку видаляємо старий індекс
                try {
                    await model.collection.dropIndex({ [`data.${fieldName}`]: 1 });
                } catch (e) {
                    // Ігноруємо помилку, якщо індекс не існує
                }

                // Створюємо новий індекс
                await model.collection.createIndex({ [`data.${fieldName}`]: 1 });

                this.logger.info(`Оновлено поле ${fieldName} в моделі ${entityName}`);
            } else {
                this.logger.warn(`Модель для сутності ${entityName} не знайдена`);
            }
        } catch (error) {
            this.logger.error(`Помилка при оновленні поля ${fieldName} в моделі ${entityName}:`, error);
            throw error;
        }
    }

    /**
     * Видалення поля з моделі
     */
    async deleteField(entityName: string, fieldName: string): Promise<void> {
        // В MongoDB не потрібно змінювати схему для видалення поля
        // Але ми можемо видалити індекс і запустити оновлення всіх документів, щоб видалити поле
        try {
            if (this.models.has(entityName)) {
                const model = this.models.get(entityName)!;

                // Видаляємо індекс
                try {
                    await model.collection.dropIndex({ [`data.${fieldName}`]: 1 });
                } catch (e) {
                    // Ігноруємо помилку, якщо індекс не існує
                }

                // Видаляємо поле з усіх документів
                await model.updateMany({}, { $unset: { [`data.${fieldName}`]: 1 } });

                this.logger.info(`Видалено поле ${fieldName} з моделі ${entityName}`);
            } else {
                this.logger.warn(`Модель для сутності ${entityName} не знайдена`);
            }
        } catch (error) {
            this.logger.error(`Помилка при видаленні поля ${fieldName} з моделі ${entityName}:`, error);
            throw error;
        }
    }
}