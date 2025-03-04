// modules/low-code-platform/metadata-service/src/controllers/view.controller.ts

import { Request, Response } from 'express';
import { IViewService } from '../interfaces';

export class ViewController {
    private viewService: IViewService;

    constructor(viewService: IViewService) {
        this.viewService = viewService;
    }

    /**
     * Створення нового представлення
     */
    createView = async (req: Request, res: Response): Promise<void> => {
        try {
            const view = await this.viewService.createView(req.body);
            res.status(201).json({
                success: true,
                data: view
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Отримання представлення за ID
     */
    getView = async (req: Request, res: Response): Promise<void> => {
        try {
            const view = await this.viewService.getView(req.params.id);

            if (!view) {
                res.status(404).json({
                    success: false,
                    error: 'Представлення не знайдено'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: view
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Отримання списку представлень з пагінацією та фільтрацією
     */
    getViews = async (req: Request, res: Response): Promise<void> => {
        try {
            const result = await this.viewService.getViews(req.query);

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
     * Отримання представлень сутності
     */
    getViewsByEntity = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityId } = req.params;
            const result = await this.viewService.getViewsByEntity(entityId, req.query);

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
     * Отримання представлення за замовчуванням для сутності і типу
     */
    getDefaultView = async (req: Request, res: Response): Promise<void> => {
        try {
            const { entityId, type } = req.params;
            const view = await this.viewService.getDefaultView(entityId, type);

            if (!view) {
                res.status(404).json({
                    success: false,
                    error: 'Представлення за замовчуванням не знайдено'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: view
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Оновлення представлення
     */
    updateView = async (req: Request, res: Response): Promise<void> => {
        try {
            const view = await this.viewService.updateView(req.params.id, req.body);

            if (!view) {
                res.status(404).json({
                    success: false,
                    error: 'Представлення не знайдено'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: view
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };

    /**
     * Видалення представлення
     */
    deleteView = async (req: Request, res: Response): Promise<void> => {
        try {
            const view = await this.viewService.deleteView(req.params.id);

            if (!view) {
                res.status(404).json({
                    success: false,
                    error: 'Представлення не знайдено'
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
     * Перевірка унікальності імені представлення в рамках сутності
     */
    validateViewName = async (req: Request, res: Response): Promise<void> => {
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
                    error: 'Ім\'я представлення не вказано'
                });
                return;
            }

            const isValid = await this.viewService.validateViewName(entityId, name);

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
     * Встановлення представлення як дефолтного
     */
    setDefaultView = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;
            const view = await this.viewService.setDefaultView(id);

            if (!view) {
                res.status(404).json({
                    success: false,
                    error: 'Представлення не знайдено'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: view
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    };
}