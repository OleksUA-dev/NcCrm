// modules/low-code-platform/metadata-service/src/interfaces/service.interfaces.ts

import { Document } from 'mongoose';
import {
    CreateEntityDto,
    UpdateEntityDto,
    CreateFieldDto,
    UpdateFieldDto,
    CreateViewDto,
    UpdateViewDto,
    QueryParams,
    PaginatedResponse
} from './dto.interfaces';
import { IEntity } from '../models/entity.model';
import { IField } from '../models/field.model';
import { IView } from '../models/view.model';

// Інтерфейс для сервісу сутностей
export interface IEntityService {
    createEntity(dto: CreateEntityDto): Promise<Document & IEntity>;
    getEntity(id: string): Promise<Document & IEntity | null>;
    getEntities(queryParams: QueryParams): Promise<PaginatedResponse<Document & IEntity>>;
    updateEntity(id: string, dto: UpdateEntityDto): Promise<Document & IEntity | null>;
    deleteEntity(id: string): Promise<Document & IEntity | null>;
    validateEntityName(name: string): Promise<boolean>;
    generateTableName(name: string): Promise<string>;
}

// Інтерфейс для сервісу полів
export interface IFieldService {
    createField(dto: CreateFieldDto): Promise<Document & IField>;
    getField(id: string): Promise<Document & IField | null>;
    getFields(queryParams: QueryParams): Promise<PaginatedResponse<Document & IField>>;
    getFieldsByEntity(entityId: string, queryParams: QueryParams): Promise<PaginatedResponse<Document & IField>>;
    updateField(id: string, dto: UpdateFieldDto): Promise<Document & IField | null>;
    deleteField(id: string): Promise<Document & IField | null>;
    validateFieldName(entityId: string, name: string): Promise<boolean>;
    reorderFields(entityId: string, fieldIds: string[]): Promise<(Document & IField)[]>;
}

// Інтерфейс для сервісу представлень
export interface IViewService {
    createView(dto: CreateViewDto): Promise<Document & IView>;
    getView(id: string): Promise<Document & IView | null>;
    getViews(queryParams: QueryParams): Promise<PaginatedResponse<Document & IView>>;
    getViewsByEntity(entityId: string, queryParams: QueryParams): Promise<PaginatedResponse<Document & IView>>;
    getDefaultView(entityId: string, type: string): Promise<Document & IView | null>;
    updateView(id: string, dto: UpdateViewDto): Promise<Document & IView | null>;
    deleteView(id: string): Promise<Document & IView | null>;
    validateViewName(entityId: string, name: string): Promise<boolean>;
    setDefaultView(id: string): Promise<Document & IView | null>;
}

// Інтерфейс для сервісу Kafka
export interface IKafkaService {
    publishEntityCreated(entity: Document & IEntity): Promise<void>;
    publishEntityUpdated(entity: Document & IEntity): Promise<void>;
    publishEntityDeleted(entity: Document & IEntity): Promise<void>;
    publishFieldCreated(field: Document & IField): Promise<void>;
    publishFieldUpdated(field: Document & IField): Promise<void>;
    publishFieldDeleted(field: Document & IField): Promise<void>;
}