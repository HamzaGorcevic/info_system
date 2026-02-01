import { ZodTypeAny } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate = (schemas: { body?: ZodTypeAny; query?: ZodTypeAny; params?: ZodTypeAny }) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const processData = (schema: ZodTypeAny, target: any, isBody: boolean) => {
                const parsed = schema.parse(target) as Record<string, any>;

                const cleaned = Object.fromEntries(
                    Object.entries(parsed).filter(([_, value]) => value !== undefined)
                );

                if (isBody) {
                    return cleaned;
                } else {
                    Object.keys(target).forEach(key => delete target[key]);
                    Object.assign(target, cleaned);
                    return target;
                }
            };

            if (schemas.body) req.body = processData(schemas.body, req.body, true);
            if (schemas.query) processData(schemas.query, req.query, false);
            if (schemas.params) processData(schemas.params, req.params, false);

            next();
        } catch (error) {
            next(error);
        }
    };