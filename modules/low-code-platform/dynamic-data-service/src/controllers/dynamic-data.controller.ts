// modules/low-code-platform/dynamic-data-service/src/controllers/dynamic-data.controller.ts

import { Request, Response } from 'express';
import { IDynamicDataService } from '../interfaces';

export class DynamicDataController {
    private dynamicDataService: IDynamicDataService;

    constructor(dynamicDataService: IDynamicDataService) {
        this.dynamicDataService = dynamicDataService;
    }

    /**
     * Створення нового запису
     */
    createRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityName } = req.params;
            const userId = req.headers['user-id'] as string; // В реальному додатку буде аутентифікація

            const record = await this.dynamicDataService.createRecord(entityName, req.body, userId);

            res.status(201).json({
                success: true,
                data: record
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Отримання запису за ID
     */
    getRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityName, id } = req.params;

            const record = await this.dynamicDataService.getRecord(entityName, id);

            if (!record) {
                res.status(404).json({
                    success: false,
                    error: 'Запис не знайдено'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: record
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Отримання списку записів з пагінацією та фільтрацією
     */
    getRecords = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityName } = req.params;

            const result = await this.dynamicDataService.getRecords(entityName, req.query);

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
     * Оновлення запису
     */
    updateRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityName, id } = req.params;
            const userId = req.headers['user-id'] as string; // В реальному додатку буде аутентифікація

            const record = await this.dynamicDataService.updateRecord(entityName, id, req.body, userId);

            if (!record) {
                res.status(404).json({
                    success: false,
                    error: 'Запис не знайдено'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: record
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Видалення запису
     */
    deleteRecord = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityName, id } = req.params;

            const record = await this.dynamicDataService.deleteRecord(entityName, id);

            if (!record) {
                res.status(404).json({
                    success: false,
                    error: 'Запис не знайдено'
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
     * Валідація даних
     */
    validateData = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityName } = req.params;

            const validation = await this.dynamicDataService.validateData(entityName, req.body);

            res.status(200).json({
                success: true,
                data: validation
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };
}