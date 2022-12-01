import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { connect } from '@src/database';
import { StatusCodes } from 'http-status-codes';
import CustomError from '@src/erros/customError';

class Authentication {
  public register = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const userID = crypto.randomUUID({ disableEntropyCache: true });

    return connect
      .execute(
        `INSERT INTO user_tbl (user_id, user_name, user_email, user_password) VALUES (?,?,?,?)`,
        [userID, req.body.username, req.body.useremail, req.body.userpassword]
      )
      .then((result) => {
        console.log(result);
        return res
          .status(StatusCodes.CREATED)
          .json({ message: 'Registro realizado com sucesso' });
      })
      .catch((error) => {
        throw new CustomError(
          `Não foi possível realizar seu registro: ${error.message}`,
          StatusCodes.BAD_GATEWAY
        );
      });
  };
}

export const authenticationController = new Authentication();
