import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

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
}

export const jwtOptions = new JWT();
