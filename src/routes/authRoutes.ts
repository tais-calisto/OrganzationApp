import { authenticationController } from '@src/controllers/authController';
import { connect } from '@src/database';
import { Router } from 'express';
import { body, CustomValidator } from 'express-validator';
import { RowDataPacket } from 'mysql2';

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

const isEmailAvaliable: CustomValidator = async (value) => {
  const searchEmail = await connect
    .query<RowDataPacket[]>(
      `SELECT * FROM user_tbl WHERE user_email = '${value}'`
    )
    .then((response) => {
      const result = response[0];
      if (result.length > 0) {
        return Promise.reject('E-mail já cadastrado');
      } else {
        return Promise.resolve();
      }
    });
};

const isEmailRegistered: CustomValidator = async (value) => {
  const searchEmail = await connect
    .query<RowDataPacket[]>(
      `SELECT * FROM user_tbl WHERE user_email = '${value}'`
    )
    .then((response) => {
      const result = response[0];
      if (result.length > 0) {
        return Promise.resolve();
      } else {
        return Promise.reject('E-mail não cadastrado');
      }
    });
};

router.post(
  '/register',
  body('username').not().isEmpty().withMessage('Campo nome é obrigatório'),
  body('useremail')
    .not()
    .isEmpty()
    .withMessage('Campo e-mail é obrigatório')
    .isEmail()
    .withMessage('Por favor, escreva um e-mail válido')
    .custom(isEmailAvaliable),
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

router.post(
  '/login',
  body('useremail')
    .not()
    .isEmpty()
    .withMessage('Campo e-mail é obrigatório')
    .isEmail()
    .withMessage('Por favor, escreva um e-mail válido')
    .custom(isEmailRegistered),
  body('userpassword').not().isEmpty().withMessage('Campo senha é obrigatório'),
  authenticationController.login
);

export default router;
