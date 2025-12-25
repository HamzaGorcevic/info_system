import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { registerAdminSchema, loginSchema } from '../schemas/auth.schema.js';

export class AuthController {
    async registerAdmin(req: Request, res: Response, next: NextFunction) {
        try {
            const validatedData = registerAdminSchema.parse(req.body);
            const result = await authService.registerAdmin(validatedData);
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
            const validatedData = loginSchema.parse(req.body);
            const result = await authService.login(validatedData);
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
            const validatedData = req.body;
            const result = await authService.registerTenant(validatedData);
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
            const userId = req.query.userId as string;
            if (!userId) throw new Error("User ID required");
            const result = await authService.getAdminBuildings(userId);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
