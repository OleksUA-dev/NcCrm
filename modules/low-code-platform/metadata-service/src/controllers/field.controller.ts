// modules/low-code-platform/metadata-service/src/controllers/field.controller.ts

import { Request, Response } from 'express';
import { IFieldService } from '../interfaces';

export class FieldController {
    private fieldService: IFieldService;

    constructor(fieldService: IFieldService) {
        this.fieldService = fieldService;
    }

    /**
     * Створення нового поля
     */
    createField = async (req: Request, res: Response): Promise<void> => {
        try {
            const field = await this.fieldService.createField(req.body);
            res.status(201).json({
                success: true,
                data: field
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Отримання поля за ID
     */
    getField = async (req: Request, res: Response): Promise<void> => {
        try {
            const field = await this.fieldService.getField(req.params.id);

            if (!field) {
                res.status(404).json({
                    success: false,
                    error: 'Поле не знайдено'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: field
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Отримання списку полів з пагінацією та фільтрацією
     */
    getFields = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.fieldService.getFields(req.query);

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
     * Отримання полів сутності
     */
    getFieldsByEntity = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityId } = req.params;
            const result = await this.fieldService.getFieldsByEntity(entityId, req.query);

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
     * Оновлення поля
     */
    updateField = async (req: Request, res: Response): Promise<void> => {
        try {
            const field = await this.fieldService.updateField(req.params.id, req.body);

            if (!field) {
                res.status(404).json({
                    success: false,
                    error: 'Поле не знайдено'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: field
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Видалення поля
     */
    deleteField = async (req: Request, res: Response): Promise<void> => {
        try {
            const field = await this.fieldService.deleteField(req.params.id);

            if (!field) {
                res.status(404).json({
                    success: false,
                    error: 'Поле не знайдено'
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
     * Перевірка унікальності імені поля в рамках сутності
     */
    validateFieldName = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityId, name } = req.query;

            if (!entityId || typeof entityId !== 'string') {
                res.status(400).json({
                    success: false,
                    error: 'ID сутності не вказано'
                });
                return;
            }

            if (!name || typeof name !== 'string') {
                res.status(400).json({
                    success: false,
                    error: 'Ім\'я поля не вказано'
                });
                return;
            }

            const isValid = await this.fieldService.validateFieldName(entityId, name);

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
     * Зміна порядку полів
     */
    reorderFields = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityId } = req.params;
            const { fieldIds } = req.body;

            if (!Array.isArray(fieldIds)) {
                res.status(400).json({
                    success: false,
                    error: 'FieldIds повинні бути масивом'
                });
                return;
            }

            const updatedFields = await this.fieldService.reorderFields(entityId, fieldIds);

            res.status(200).json({
                success: true,
                data: updatedFields
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };
}