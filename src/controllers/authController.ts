import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { connect } from '@src/database';
import { StatusCodes } from 'http-status-codes';
import CustomError from '@src/erros/customError';
import bcrypt from 'bcrypt';
import { jwtOptions } from '@src/util/jwt';

class Authentication {
  public createUserResponse(userName: string, userID: string): object {
    return {
      name: userName,
      id: userID,
    };
  }

  public hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  };

  public register = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const userID = crypto.randomUUID({ disableEntropyCache: true });
    const password = await this.hashPassword(req.body.userpassword);
    const user = this.createUserResponse(req.body.username, userID);

    return connect
      .execute(
        `INSERT INTO user_tbl (user_id, user_name, user_email, user_password) VALUES (?,?,?,?)`,
        [userID, req.body.username, req.body.useremail, password]
      )
      .then(() => {
        jwtOptions.attachCookiesToResponse(res, user);
        return res.status(StatusCodes.CREATED).json({ user });
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
