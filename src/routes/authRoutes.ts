import { authenticationController } from '@src/controllers/authController';
import { Router } from 'express';
import { body } from 'express-validator';

const router: Router = Router();

router.post(
  '/register',
  body('username').not().isEmpty().withMessage('Campo nome é obrigatório'),
  body('useremail')
    .isEmail()
    .withMessage('Por favor, escreva um e-mail válido'),
  body('userpassword')
    .isLength({ min: 8 })
    .withMessage('Senha deve conter pelo menos 8 caracteres'),
  authenticationController.register
);

export default router;
