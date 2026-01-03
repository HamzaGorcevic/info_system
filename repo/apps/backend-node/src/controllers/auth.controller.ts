import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { RepositoryFactory } from '../factories/repository.factory.js';
import { supabaseAdmin } from '@repo/supabase';

export class AuthController {

    async registerAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const context = { db: supabaseAdmin, currentUser: null };
            const userRepository = RepositoryFactory.getUserRepository(context);

            const result = await authService.registerAdmin(userRepository, req.body);
            res.status(201).json({
                message: 'Admin and Building registered successfully',
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.login(req.body);
            res.status(200).json({
                message: 'Login successful',
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async registerTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.registerTenant(req.body);
            res.status(201).json({
                message: 'Tenant registered successfully. Awaiting verification.',
                ...result
            });
        } catch (error) {
            next(error);
        }
    }

    async getAdminBuildings(req: Request, res: Response, next: NextFunction) {
        try {
            const context = req.context;
            const buildingRepository = RepositoryFactory.getBuildingRepository(context);

            const userId = req.query.userId as string;
            if (!userId) throw new Error("User ID required");
            const result = await authService.getAdminBuildings(buildingRepository, userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
