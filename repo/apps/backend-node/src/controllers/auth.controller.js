import { AuthService } from '../services/auth.service.js';
export class AuthController {
    authService;
    constructor(authService = new AuthService()) {
        this.authService = authService;
        this.registerAdmin = this.registerAdmin.bind(this);
        this.login = this.login.bind(this);
        this.registerTenant = this.registerTenant.bind(this);
        this.getAdminBuildings = this.getAdminBuildings.bind(this);
    }
    async registerAdmin(req, res, next) {
        try {
            const result = await this.authService.registerAdmin(req.body);
            res.status(201).json({
                message: 'Admin and Building registered successfully',
                ...result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async login(req, res, next) {
        try {
            const result = await this.authService.login(req.body);
            res.status(200).json({
                message: 'Login successful',
                ...result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async registerTenant(req, res, next) {
        try {
            const result = await this.authService.registerTenant(req.body);
            res.status(201).json({
                message: 'Tenant registered successfully. Awaiting verification.',
                ...result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getAdminBuildings(req, res, next) {
        try {
            const userId = req.query.userId;
            if (!userId)
                throw new Error("User ID required");
            const result = await this.authService.getAdminBuildings(userId);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
export const authController = new AuthController();
