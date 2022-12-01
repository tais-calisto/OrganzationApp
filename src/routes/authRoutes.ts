import { authenticationController } from '@src/controllers/authController';
import { Router } from 'express';
import { body, CustomValidator } from 'express-validator';

const router: Router = Router();

const isUppercase: CustomValidator = (value) => {
  if (!/[A-Z]/.test(value)) {
    return Promise.reject('Necessário letra maiúscula');
  } else {
    return Promise.resolve();
  }
};
const isLowercase: CustomValidator = (value) => {
  if (!/[a-z]/.test(value)) {
    return Promise.reject('Necessário letra minúscula');
  } else {
    return Promise.resolve();
  }
};
const isNumber: CustomValidator = (value) => {
  if (!/[0-9]/.test(value)) {
    return Promise.reject('Necessário caracter numérico');
  } else {
    return Promise.resolve();
  }
};
const isSpecialChar: CustomValidator = (value) => {
  if (!/[!@#\$%\^\&*\)\(\/\\+=._-]/.test(value)) {
    return Promise.reject('Necessário caracter especial');
  } else {
    return Promise.resolve();
  }
};

router.post(
  '/register',
  body('username').not().isEmpty().withMessage('Campo nome é obrigatório'),
  body('useremail')
    .not()
    .isEmpty()
    .withMessage('Campo e-mail é obrigatório')
    .isEmail()
    .withMessage('Por favor, escreva um e-mail válido'),
  body('userpassword')
    .not()
    .isEmpty()
    .withMessage('Campo senha é obrigatório')
    .isLength({ min: 8 })
    .withMessage('Senha deve conter pelo menos 8 caracteres')
    .custom(isLowercase)
    .custom(isUppercase)
    .custom(isNumber)
    .custom(isSpecialChar),
  authenticationController.register
);

export default router;
