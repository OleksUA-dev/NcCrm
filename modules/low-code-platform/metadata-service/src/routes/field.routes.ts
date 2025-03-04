// modules/low-code-platform/metadata-service/src/routes/field.routes.ts

import { Router } from 'express';
import { FieldController } from '../controllers';

export const createFieldRoutes = (fieldController: FieldController): Router => {
    const router = Router();

    /**
     * @route   POST /api/v1/fields
     * @desc    Створення нового поля
     * @access  Private
     */
    router.post('/', fieldController.createField);

    /**
     * @route   GET /api/v1/fields
     * @desc    Отримання списку полів
     * @access  Private
     */
    router.get('/', fieldController.getFields);

    /**
     * @route   GET /api/v1/fields/:id
     * @desc    Отримання поля за ID
     * @access  Private
     */
    router.get('/:id', fieldController.getField);

    /**
     * @route   GET /api/v1/fields/entity/:entityId
     * @desc    Отримання полів сутності
     * @access  Private
     */
    router.get('/entity/:entityId', fieldController.getFieldsByEntity);

    /**
     * @route   PUT /api/v1/fields/:id
     * @desc    Оновлення поля
     * @access  Private
     */
    router.put('/:id', fieldController.updateField);

    /**
     * @route   DELETE /api/v1/fields/:id
     * @desc    Видалення поля
     * @access  Private
     */
    router.delete('/:id', fieldController.deleteField);

    /**
     * @route   GET /api/v1/fields/validate/name
     * @desc    Перевірка унікальності імені поля в рамках сутності
     * @access  Private
     */
    router.get('/validate/name', fieldController.validateFieldName);

    /**
     * @route   POST /api/v1/fields/entity/:entityId/reorder
     * @desc    Зміна порядку полів
     * @access  Private
     */
    router.post('/entity/:entityId/reorder', fieldController.reorderFields);

    return router;
};