// Типи для роботи з сутностями

// Базовий інтерфейс для всіх сутностей
export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

// Інтерфейс для сутності
export interface Entity extends BaseEntity {
    name: string;
    displayName: string;
    description?: string;
    tableName: string;
    isSystem: boolean;
    isActive: boolean;
}

// DTO для створення сутності
export interface CreateEntityDto {
    name: string;
    displayName: string;
    description?: string;
    tableName?: string; // Якщо не вказано, генерується автоматично з name
    isSystem?: boolean;
    isActive?: boolean;
}

// DTO для оновлення сутності
export interface UpdateEntityDto {
    displayName?: string;
    description?: string;
    isActive?: boolean;
}

// Відповідь API з пагінацією
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    pages: number;
}

// Параметри фільтрації для запитів
export interface QueryParams {
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    populate?: string;
}

// Тип для відповіді від API
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    error?: string;
}