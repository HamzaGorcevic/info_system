import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import fs from 'fs';

import { AppError } from '../utils/AppError.js';

import { logger } from '../utils/logger.js';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {


    logger.error({
        err,
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    }, 'Unhandled Error');


    if (err instanceof z.ZodError) {
        return res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            details: err.issues
        });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }

    // Default to 500 Server Error
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Attach error to response for pino-http to log the actual error
    (res as any).err = err;

    res.status(status).json({
        status: 'error',
        message: message
    });
};
