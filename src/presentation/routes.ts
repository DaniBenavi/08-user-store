import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';

export class AppRoutes {
  static get routes(): Router {
    const router = Router();

    // Definir las rutas
    router.use('/api/auth', AuthRoutes.routes);
    router.use('/api/categories', CategoryRoutes.routes); // Assuming you have a CategoryRoutes similar to AuthRoutes

    return router;
  }
}
