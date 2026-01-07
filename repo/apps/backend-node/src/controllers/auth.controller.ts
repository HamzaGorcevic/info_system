import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';
import { supabaseAdmin } from '@repo/supabase';

export class AuthController {

    async registerAdmin(req: Request, res: Response, next: NextFunction) {
        const context = { db: supabaseAdmin, currentUser: null };
        const authService = ServiceFactory.getAuthService(context);

        const result = await authService.registerAdmin(req.body);
        res.status(201).json({
            message: 'Admin and Building registered successfully',
            ...result
        });
    }

    async login(req: Request, res: Response, next: NextFunction) {
        const context = { db: supabaseAdmin, currentUser: null };
        const authService = ServiceFactory.getAuthService(context);

        const result = await authService.login(req.body);
        res.status(200).json({
            message: 'Login successful',
            ...result
        });
    }

    async registerTenant(req: Request, res: Response, next: NextFunction) {
        const context = { db: supabaseAdmin, currentUser: null };
        const authService = ServiceFactory.getAuthService(context);

        const result = await authService.registerTenant(req.body);
        res.status(201).json({
            message: 'Tenant registered successfully. Awaiting verification.',
            ...result
        });
    }

    async getAdminBuildings(req: Request, res: Response, next: NextFunction) {
        const authService = ServiceFactory.getAuthService(req.context);

        const userId = req.query.userId as string;
        if (!userId) throw new Error("User ID required");
        const result = await authService.getAdminBuildings(userId);
        res.status(200).json(result);
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        const context = { db: supabaseAdmin, currentUser: null };
        const authService = ServiceFactory.getAuthService(context);

        const { refreshToken } = req.body;
        if (!refreshToken) throw new Error("Refresh token required");

        const result = await authService.refreshToken(refreshToken);
        res.status(200).json({
            message: 'Token refreshed successfully',
            ...result
        });
    }
}

export const authController = new AuthController();
