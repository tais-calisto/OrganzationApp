import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import crypto from 'crypto';
import { connect } from '@src/database';
import { StatusCodes } from 'http-status-codes';
import CustomError from '@src/erros/customError';
import bcrypt from 'bcrypt';
import { jwtOptions } from '@src/util/jwt';
import { RowDataPacket } from 'mysql2';

class Authentication {
  public createUserResponse(
    userName: string,
    userID: string,
    userEmail?: string
  ): object {
    return {
      name: userName,
      id: userID,
      email: userEmail,
    };
  }

  public hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
  };

  public comparePasswords = async (
    candidatePassword: string,
    userPassword: string
  ) => {
    const IsMatch = await bcrypt.compare(candidatePassword, userPassword);
    return IsMatch;
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

  public login = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    return connect
      .query<RowDataPacket[]>(`SELECT * FROM user_tbl WHERE user_email = ?`, [
        req.body.useremail,
      ])
      .then(async (response) => {
        const user = response[0][0];
        const candidatePassword = req.body.userpassword;
        const userPassword = user.user_password;

        const isValidPassword = await this.comparePasswords(
          candidatePassword,
          userPassword
        );

        if (!isValidPassword) {
          throw new CustomError('Senha incorreta', StatusCodes.UNAUTHORIZED);
        } else {
          const userToken = this.createUserResponse(
            user.user_name,
            user.user_id,
            user.user_email
          );
          jwtOptions.attachCookiesToResponse(res, userToken);
          return res.status(StatusCodes.CREATED).json({ userToken });
        }
      });
  };

  public logout = async (req: Request, res: Response) => {
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json('Deslogado com sucesso');
  };
}

export const authenticationController = new Authentication();
