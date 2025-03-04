// modules/low-code-platform/dynamic-data-service/src/routes/dynamic-data.routes.ts

import { Router } from 'express';
import { DynamicDataController } from '../controllers/dynamic-data.controller';

export const createDynamicDataRoutes = (dynamicDataController: DynamicDataController): Router => {
    const router = Router();

    /**
     * @route   POST /api/v1/data/:entityName
     * @desc    Створення нового запису
     * @access  Private
     */
    router.post('/:entityName', dynamicDataController.createRecord);

    /**
     * @route   GET /api/v1/data/:entityName
     * @desc    Отримання списку записів
     * @access  Private
     */
    router.get('/:entityName', dynamicDataController.getRecords);

    /**
     * @route   GET /api/v1/data/:entityName/:id
     * @desc    Отримання запису за ID
     * @access  Private
     */
    router.get('/:entityName/:id', dynamicDataController.getRecord);

    /**
     * @route   PUT /api/v1/data/:entityName/:id
     * @desc    Оновлення запису
     * @access  Private
     */
    router.put('/:entityName/:id', dynamicDataController.updateRecord);

    /**
     * @route   DELETE /api/v1/data/:entityName/:id
     * @desc    Видалення запису
     * @access  Private
     */
    router.delete('/:entityName/:id', dynamicDataController.deleteRecord);

    /**
     * @route   POST /api/v1/data/:entityName/validate
     * @desc    Валідація даних
     * @access  Private
     */
    router.post('/:entityName/validate', dynamicDataController.validateData);

    return router;
};