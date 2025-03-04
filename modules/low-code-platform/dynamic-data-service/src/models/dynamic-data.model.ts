// modules/low-code-platform/dynamic-data-service/src/models/dynamic-data.model.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IDynamicData extends Document {
    entityId: string;
    data: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
}

// Функція для створення моделі динамічних даних для конкретної сутності
export const createDynamicDataModel = (entityName: string, tableName: string): mongoose.Model<IDynamicData> => {
    // Створення схеми з динамічними полями
    const DynamicDataSchema: Schema = new Schema(
        {
            entityId: {
                type: String,
                required: true,
                index: true
            },
            data: {
                type: Schema.Types.Mixed,
                default: {}
            },
            createdBy: {
                type: String
            },
            updatedBy: {
                type: String
            }
        },
        {
            timestamps: true,
            collection: tableName // Використання tableName як імені колекції
        }
    );

    // Індекси для оптимізації пошуку
    DynamicDataSchema.index({ 'data.id': 1 });
    DynamicDataSchema.index({ createdAt: 1 });
    DynamicDataSchema.index({ updatedAt: 1 });

    // Створення моделі з унікальним ім'ям
    return mongoose.model<IDynamicData>(`DynamicData_${entityName}`, DynamicDataSchema);
};