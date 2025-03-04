// modules/low-code-platform/metadata-service/src/routes/index.ts

import { Router } from 'express';
import { EntityController, FieldController, ViewController } from '../controllers';
import { createEntityRoutes } from './entity.routes';
import { createFieldRoutes } from './field.routes';
import { createViewRoutes } from './view.routes';

export const createRoutes = (
    entityController: EntityController,
    fieldController: FieldController,
    viewController: ViewController
): Router => {
    const router = Router();

    // Реєстрація маршрутів для сутностей
    router.use('/entities', createEntityRoutes(entityController));

    // Реєстрація маршрутів для полів
    router.use('/fields', createFieldRoutes(fieldController));

    // Реєстрація маршрутів для представлень
    router.use('/views', createViewRoutes(viewController));

    return router;
};