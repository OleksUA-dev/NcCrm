// modules/low-code-platform/metadata-service/src/interfaces/index.ts

import {
    BaseDto,
    CreateEntityDto,
    UpdateEntityDto,
    CreateFieldDto,
    UpdateFieldDto,
    CreateViewDto,
    UpdateViewDto,
    QueryParams,
    PaginatedResponse
} from './dto.interfaces';

import {
    IEntityService,
    IFieldService,
    IViewService,
    IKafkaService
} from './service.interfaces';

export {
    // DTO інтерфейси
    BaseDto,
    CreateEntityDto,
    UpdateEntityDto,
    CreateFieldDto,
    UpdateFieldDto,
    CreateViewDto,
    UpdateViewDto,
    QueryParams,
    PaginatedResponse,

    // Сервісні інтерфейси
    IEntityService,
    IFieldService,
    IViewService,
    IKafkaService
};