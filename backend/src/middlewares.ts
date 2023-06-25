import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { MultidimentionalNumberArray } from './interface/Validations';

export function validateRequest(validator: ZodSchema<MultidimentionalNumberArray>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await validator.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(422);
            }
            next(error);
        }
    };
}

export function notFound(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    const error = new Error( `🔍 - Not Found - ${req.originalUrl}`);
    next(error);
  }

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction){
    const statusCode = res.statusCode !== 200 ? res.statusCode: 500;
    res.status(statusCode);
    res.json({
        message: err.message
    });
}