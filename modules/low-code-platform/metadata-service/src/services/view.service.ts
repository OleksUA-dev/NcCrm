// modules/low-code-platform/metadata-service/src/services/view.service.ts

import { Document } from 'mongoose';
import { View } from '../models';
import { IView } from '../models/view.model';
import {
    CreateViewDto,
    UpdateViewDto,
    QueryParams,
    PaginatedResponse,
    IViewService
} from '../interfaces';

export class ViewService implements IViewService {
    /**
     * Створення нового представлення
     */
    async createView(dto: CreateViewDto): Promise<Document & IView> {
        try {
            // Якщо представлення встановлюється як дефолтне, зняти дефолтне з інших представлень цього типу і сутності
            if (dto.isDefault) {
                await View.updateMany(
                    {
                        entityId: dto.entityId,
                        type: dto.type,
                        isDefault: true
                    },
                    {
                        isDefault: false
                    }
                );
            }

            // Створення представлення
            const view = new View(dto);
            await view.save();

            return view;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Отримання представлення за ID
     */
    async getView(id: string): Promise<Document & IView | null> {
        try {
            const view = await View.findById(id);
            return view;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Отримання списку представлень з пагінацією та фільтрацією
     */
    async getViews(queryParams: QueryParams): Promise<PaginatedResponse<Document & IView>> {
        try {
            const { page = 1, limit = 20, sort = '-createdAt', filter, populate } = queryParams;
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
            const total = await View.countDocuments(query);
            let viewsQuery = View.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit);

            // Додавання populate якщо потрібно
            if (populate) {
                const populateFields = populate.split(',');
                populateFields.forEach(field => {
                    viewsQuery = viewsQuery.populate(field.trim());
                });
            }

            const views = await viewsQuery;

            return {
                data: views,
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
     * Отримання представлень сутності
     */
    async getViewsByEntity(entityId: string, queryParams: QueryParams): Promise<PaginatedResponse<Document & IView>> {
        try {
            queryParams.filter = JSON.stringify({
                ...JSON.parse(queryParams.filter || '{}'),
                entityId
            });

            return this.getViews(queryParams);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Отримання представлення за замовчуванням для сутності і типу
     */
    async getDefaultView(entityId: string, type: string): Promise<Document & IView | null> {
        try {
            const view = await View.findOne({
                entityId,
                type,
                isDefault: true,
                isActive: true
            });

            return view;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Оновлення представлення
     */
    async updateView(id: string, dto: UpdateViewDto): Promise<Document & IView | null> {
        try {
            // Якщо представлення встановлюється як дефолтне, зняти дефолтне з інших представлень
            if (dto.isDefault) {
                const view = await View.findById(id);
                if (view) {
                    await View.updateMany(
                        {
                            _id: { $ne: id },
                            entityId: view.entityId,
                            type: view.type,
                            isDefault: true
                        },
                        {
                            isDefault: false
                        }
                    );
                }
            }

            const updatedView = await View.findByIdAndUpdate(id, dto, { new: true });
            return updatedView;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Видалення представлення
     */
    async deleteView(id: string): Promise<Document & IView | null> {
        try {
            const view = await View.findByIdAndDelete(id);

            // Якщо видаляється дефолтне представлення, встановити як дефолтне інше представлення того ж типу
            if (view && view.isDefault) {
                const nextDefaultView = await View.findOne({
                    entityId: view.entityId,
                    type: view.type,
                    isActive: true,
                    _id: { $ne: id }
                }).sort({ createdAt: 1 });

                if (nextDefaultView) {
                    nextDefaultView.isDefault = true;
                    await nextDefaultView.save();
                }
            }

            return view;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Перевірка унікальності імені представлення в рамках сутності
     */
    async validateViewName(entityId: string, name: string): Promise<boolean> {
        try {
            const count = await View.countDocuments({ entityId, name });
            return count === 0;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Встановлення представлення як дефолтного
     */
    async setDefaultView(id: string): Promise<Document & IView | null> {
        try {
            const view = await View.findById(id);

            if (!view) {
                return null;
            }

            // Зняти дефолтне з інших представлень цього типу і сутності
            await View.updateMany(
                {
                    _id: { $ne: id },
                    entityId: view.entityId,
                    type: view.type,
                    isDefault: true
                },
                {
                    isDefault: false
                }
            );

            // Встановити представлення як дефолтне
            view.isDefault = true;
            await view.save();

            return view;
        } catch (error) {
            throw error;
        }
    }
}