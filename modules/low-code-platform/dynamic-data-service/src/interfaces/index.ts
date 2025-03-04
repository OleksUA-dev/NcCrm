// modules/low-code-platform/dynamic-data-service/src/interfaces/index.ts

import { Document } from 'mongoose';
import { IDynamicData } from '../models/dynamic-data.model';

// Query Parameters
export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    populate?: string;
    fields?: string; // Для select полів
}

// Інтерфейс для відповіді з пагінацією
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

// Інтерфейси для сервісу динамічних даних
export interface IDynamicDataService {
    createRecord(entityName: string, data: Record<string, any>, userId?: string): Promise<Document & IDynamicData>;
    getRecord(entityName: string, recordId: string): Promise<Document & IDynamicData | null>;
    getRecords(entityName: string, queryParams: QueryParams): Promise<PaginatedResponse<Document & IDynamicData>>;
    updateRecord(entityName: string, recordId: string, data: Record<string, any>, userId?: string): Promise<Document & IDynamicData | null>;
    deleteRecord(entityName: string, recordId: string): Promise<Document & IDynamicData | null>;
    validateData(entityName: string, data: Record<string, any>): Promise<{ isValid: boolean; errors?: Record<string, string> }>;
}

// Інтерфейс для менеджера моделей (створює та керує динамічними моделями)
export interface IModelManager {
    createEntityModel(entityName: string, tableName: string): Promise<void>;
    updateEntityModel(entityName: string, tableName: string): Promise<void>;
    deleteEntityModel(entityName: string): Promise<void>;
    getEntityModel(entityName: string): Promise<any>;
    addField(entityName: string, fieldName: string, fieldType: string, required: boolean): Promise<void>;
    updateField(entityName: string, fieldName: string, fieldType: string, required: boolean): Promise<void>;
    deleteField(entityName: string, fieldName: string): Promise<void>;
}

// Інтерфейс для обробника подій Kafka
export interface IKafkaHandler {
    handleEntityCreated(payload: any): Promise<void>;
    handleEntityUpdated(payload: any): Promise<void>;
    handleEntityDeleted(payload: any): Promise<void>;
    handleFieldCreated(payload: any): Promise<void>;
    handleFieldUpdated(payload: any): Promise<void>;
    handleFieldDeleted(payload: any): Promise<void>;
}