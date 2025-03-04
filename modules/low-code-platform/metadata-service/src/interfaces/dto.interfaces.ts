// modules/low-code-platform/metadata-service/src/interfaces/dto.interfaces.ts

import { FieldType } from '../models/field.model';
import { ViewType } from '../models/view.model';
import { Document } from 'mongoose';

// Базовий інтерфейс для DTO
export interface BaseDto {
    id?: string;
}

// DTO для створення сутності
export interface CreateEntityDto extends BaseDto {
    name: string;
    displayName: string;
    description?: string;
    tableName?: string; // якщо не вказано, генерується автоматично з name
    isSystem?: boolean;
    isActive?: boolean;
}

// DTO для оновлення сутності
export interface UpdateEntityDto extends BaseDto {
    displayName?: string;
    description?: string;
    isActive?: boolean;
}

// DTO для створення поля
export interface CreateFieldDto extends BaseDto {
    entityId: string;
    name: string;
    displayName: string;
    description?: string;
    type: FieldType;
    isRequired?: boolean;
    isReadOnly?: boolean;
    isSystem?: boolean;
    isActive?: boolean;
    defaultValue?: any;
    order?: number;
    options?: {
        value: string;
        label: string;
        color?: string;
    }[];
    validationRules?: {
        type: 'required' | 'min' | 'max' | 'pattern' | 'unique' | 'custom';
        value?: any;
        message: string;
        enabled?: boolean;
    }[];
    lookupEntity?: string;
    lookupField?: string;
}

// DTO для оновлення поля
export interface UpdateFieldDto extends BaseDto {
    displayName?: string;
    description?: string;
    isRequired?: boolean;
    isReadOnly?: boolean;
    isActive?: boolean;
    defaultValue?: any;
    order?: number;
    options?: {
        value: string;
        label: string;
        color?: string;
    }[];
    validationRules?: {
        type: 'required' | 'min' | 'max' | 'pattern' | 'unique' | 'custom';
        value?: any;
        message: string;
        enabled?: boolean;
    }[];
    lookupEntity?: string;
    lookupField?: string;
}

// DTO для створення представлення
export interface CreateViewDto extends BaseDto {
    entityId: string;
    name: string;
    displayName: string;
    description?: string;
    type: ViewType;
    isDefault?: boolean;
    isSystem?: boolean;
    isActive?: boolean;
    config?: {
        columns?: {
            fieldId: string;
            width?: number;
            order: number;
            isVisible?: boolean;
            isSortable?: boolean;
            isFilterable?: boolean;
        }[];
        sections?: {
            title: string;
            order: number;
            isCollapsible?: boolean;
            isCollapsed?: boolean;
            columns?: number;
            fields: {
                fieldId: string;
                order: number;
                colSpan?: number;
            }[];
        }[];
        filters?: {
            fieldId: string;
            operator: string;
            value?: any;
            isDefault?: boolean;
        }[];
        sorts?: {
            fieldId: string;
            direction?: 'asc' | 'desc';
            order: number;
        }[];
        pageSize?: number;
        customSettings?: any;
    };
}

// DTO для оновлення представлення
export interface UpdateViewDto extends BaseDto {
    displayName?: string;
    description?: string;
    isDefault?: boolean;
    isActive?: boolean;
    config?: {
        columns?: {
            fieldId: string;
            width?: number;
            order: number;
            isVisible?: boolean;
            isSortable?: boolean;
            isFilterable?: boolean;
        }[];
        sections?: {
            title: string;
            order: number;
            isCollapsible?: boolean;
            isCollapsed?: boolean;
            columns?: number;
            fields: {
                fieldId: string;
                order: number;
                colSpan?: number;
            }[];
        }[];
        filters?: {
            fieldId: string;
            operator: string;
            value?: any;
            isDefault?: boolean;
        }[];
        sorts?: {
            fieldId: string;
            direction?: 'asc' | 'desc';
            order: number;
        }[];
        pageSize?: number;
        customSettings?: any;
    };
}

// Інтерфейс для параметрів запиту
export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    populate?: string;
}

// Інтерфейс для відповіді з пагінацією
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}