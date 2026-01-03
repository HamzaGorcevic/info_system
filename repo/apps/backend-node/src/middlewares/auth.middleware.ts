import { Request, Response, NextFunction } from 'express';
import { createAuthenticatedClient } from '@repo/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            res.status(401).json({ error: 'No authorization token provided' });
            return;
        }

        const client = createAuthenticatedClient(token);

        const { data: { user }, error: userError } = await client.auth.getUser();

        if (userError || !user) {
            res.status(401).json({ error: 'Invalid or expired token' });
            return;
        }

        req.context = {
            currentUser: {
                id: user.id,
                role: user.user_metadata?.role || 'tenant'
            },
            db: client
        };

        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};
