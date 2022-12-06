import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response } from 'express';
import { oneDay } from './date';

dotenv.config();

class JWT {
  public creatJWT = (payload: object) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_LIFETIME,
    });
    return token;
  };

  public verifyJWT = (token: string) => {
    jwt.verify(token, process.env.JWT_SECRET as string);
  };

  public attachCookiesToResponse = (res: Response, user: object) => {
    const token = this.creatJWT(user);
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + oneDay),
      secure: process.env.NODE_ENV === 'production',
      signed: true,
    });
  };
}

export const jwtOptions = new JWT();
