import { Request, Response, NextFunction } from 'express';
import { supabase } from '@repo/supabase';

export const publicContextMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.context = {
        currentUser: null,
        db: supabase
    };
    next();
};
