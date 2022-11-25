import CustomError from '@src/erros/customError';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

class ErrorHandling {
  public notFound(req: Request, res: Response) {
    res.status(404).send('Route does not exist');
  }

  public globalErrorHandler(
    err: Error & CustomError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return res
      .status(err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: err.message || 'Algo deu errado' });
  }
}

export const errorHandlingMiddleware = new ErrorHandling();
