import { ZodTypeAny } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate = (schemas: { body?: ZodTypeAny }) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) req.body = schemas.body.parse(req.body);
            next();
        } catch (error) {
            next(error);
        }
    };