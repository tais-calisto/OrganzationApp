import { Router } from 'express';
import { homeController, testDBController } from '../controllers/test';

const router: Router = Router();

router.get('/', homeController.home);

router.get('/test', testDBController.home);

export { router };
