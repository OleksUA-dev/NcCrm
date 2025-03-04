// modules/low-code-platform/metadata-service/src/routes/view.routes.ts

import { Router } from 'express';
import { ViewController } from '../controllers';

export const createViewRoutes = (viewController: ViewController): Router => {
    const router = Router();

    /**
     * @route   POST /api/v1/views
     * @desc    Створення нового представлення
     * @access  Private
     */
    router.post('/', viewController.createView);

    /**
     * @route   GET /api/v1/views
     * @desc    Отримання списку представлень
     * @access  Private
     */
    router.get('/', viewController.getViews);

    /**
     * @route   GET /api/v1/views/:id
     * @desc    Отримання представлення за ID
     * @access  Private
     */
    router.get('/:id', viewController.getView);

    /**
     * @route   GET /api/v1/views/entity/:entityId
     * @desc    Отримання представлень сутності
     * @access  Private
     */
    router.get('/entity/:entityId', viewController.getViewsByEntity);

    /**
     * @route   GET /api/v1/views/entity/:entityId/type/:type/default
     * @desc    Отримання представлення за замовчуванням для сутності і типу
     * @access  Private
     */
    router.get('/entity/:entityId/type/:type/default', viewController.getDefaultView);

    /**
     * @route   PUT /api/v1/views/:id
     * @desc    Оновлення представлення
     * @access  Private
     */
    router.put('/:id', viewController.updateView);

    /**
     * @route   DELETE /api/v1/views/:id
     * @desc    Видалення представлення
     * @access  Private
     */
    router.delete('/:id', viewController.deleteView);

    /**
     * @route   GET /api/v1/views/validate/name
     * @desc    Перевірка унікальності імені представлення в рамках сутності
     * @access  Private
     */
    router.get('/validate/name', viewController.validateViewName);

    /**
     * @route   PUT /api/v1/views/:id/default
     * @desc    Встановлення представлення як дефолтного
     * @access  Private
     */
    router.put('/:id/default', viewController.setDefaultView);

    return router;
};