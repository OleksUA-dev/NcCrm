// modules/low-code-platform/metadata-service/src/controllers/entity.controller.ts

import { Request, Response } from 'express';
import { IEntityService } from '../interfaces';

export class EntityController {
    private entityService: IEntityService;

    constructor(entityService: IEntityService) {
        this.entityService = entityService;
    }

    /**
     * Створення нової сутності
     */
    createEntity = async (req: Request, res: Response): Promise<void> => {
        try {
            const entity = await this.entityService.createEntity(req.body);
            res.status(201).json({
                success: true,
                data: entity
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Отримання сутності за ID
     */
    getEntity = async (req: Request, res: Response): Promise<void> => {
        try {
            const entity = await this.entityService.getEntity(req.params.id);

            if (!entity) {
                res.status(404).json({
                    success: false,
                    error: 'Сутність не знайдена'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: entity
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Отримання списку сутностей з пагінацією та фільтрацією
     */
    getEntities = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.entityService.getEntities(req.query);

            res.status(200).json({
                success: true,
                ...result
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Оновлення сутності
     */
    updateEntity = async (req: Request, res: Response): Promise<void> => {
        try {
            const entity = await this.entityService.updateEntity(req.params.id, req.body);

            if (!entity) {
                res.status(404).json({
                    success: false,
                    error: 'Сутність не знайдена'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: entity
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Видалення сутності
     */
    deleteEntity = async (req: Request, res: Response): Promise<void> => {
        try {
            const entity = await this.entityService.deleteEntity(req.params.id);

            if (!entity) {
                res.status(404).json({
                    success: false,
                    error: 'Сутність не знайдена'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Перевірка унікальності імені сутності
     */
    validateEntityName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.query;

            if (!name || typeof name !== 'string') {
                res.status(400).json({
                    success: false,
                    error: 'Ім\'я сутності не вказано'
                });
                return;
            }

            const isValid = await this.entityService.validateEntityName(name);

            res.status(200).json({
                success: true,
                data: {
                    isValid
                }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Генерація імені таблиці
     */
    generateTableName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name } = req.query;

            if (!name || typeof name !== 'string') {
                res.status(400).json({
                    success: false,
                    error: 'Ім\'я сутності не вказано'
                });
                return;
            }

            const tableName = await this.entityService.generateTableName(name);

            res.status(200).json({
                success: true,
                data: {
                    tableName
                }
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };
}