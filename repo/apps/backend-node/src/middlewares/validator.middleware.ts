import { ZodTypeAny } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate = (schemas: { body?: ZodTypeAny, query?: ZodTypeAny, params?: ZodTypeAny }) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schemas.body) req.body = schemas.body.parse(req.body);
            if (schemas.query) req.query = schemas.query.parse(req.query) as any;
            if (schemas.params) req.params = schemas.params.parse(req.params) as any;
            next();
        } catch (error) {
            next(error);
        }
    };