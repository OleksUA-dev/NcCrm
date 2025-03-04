// modules/low-code-platform/metadata-service/src/routes/entity.routes.ts

import { Router } from 'express';
import { EntityController } from '../controllers';

export const createEntityRoutes = (entityController: EntityController): Router => {
    const router = Router();

    /**
     * @route   POST /api/v1/entities
     * @desc    Створення нової сутності
     * @access  Private
     */
    router.post('/', entityController.createEntity);

    /**
     * @route   GET /api/v1/entities
     * @desc    Отримання списку сутностей
     * @access  Private
     */
    router.get('/', entityController.getEntities);

    /**
     * @route   GET /api/v1/entities/:id
     * @desc    Отримання сутності за ID
     * @access  Private
     */
    router.get('/:id', entityController.getEntity);

    /**
     * @route   PUT /api/v1/entities/:id
     * @desc    Оновлення сутності
     * @access  Private
     */
    router.put('/:id', entityController.updateEntity);

    /**
     * @route   DELETE /api/v1/entities/:id
     * @desc    Видалення сутності
     * @access  Private
     */
    router.delete('/:id', entityController.deleteEntity);

    /**
     * @route   GET /api/v1/entities/validate/name
     * @desc    Перевірка унікальності імені сутності
     * @access  Private
     */
    router.get('/validate/name', entityController.validateEntityName);

    /**
     * @route   GET /api/v1/entities/generate/tableName
     * @desc    Генерація імені таблиці
     * @access  Private
     */
    router.get('/generate/tableName', entityController.generateTableName);

    return router;
};