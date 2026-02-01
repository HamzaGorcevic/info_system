import { Request, Response, NextFunction } from 'express';
import { ServiceFactory } from '../factories/service.factory.js';

export class ExpensesController {
    async createExpense(req: Request, res: Response, next: NextFunction) {
        const expensesService = ServiceFactory.getExpensesService(req.context);

        if (!req.context.currentUser) {
            throw new Error('Unauthorized');
        }

        const expenseData = {
            ...req.body,
            created_by: req.context.currentUser.id
        };

        const result = await expensesService.createExpense(expenseData);
        res.status(201).json(result);
    }

    async getTenantExpenses(req: Request, res: Response, next: NextFunction) {
        const expensesService = ServiceFactory.getExpensesService(req.context);
        const { tenantId } = req.params;
        const result = await expensesService.getTenantExpenses(tenantId);
        res.status(200).json(result);
    }

    async updateExpense(req: Request, res: Response, next: NextFunction) {
        const expensesService = ServiceFactory.getExpensesService(req.context);
        const { id } = req.params;
        const result = await expensesService.updateExpense(id, req.body);
        res.status(200).json(result);
    }

    async deleteExpense(req: Request, res: Response, next: NextFunction) {
        const expensesService = ServiceFactory.getExpensesService(req.context);
        const { id } = req.params;
        await expensesService.deleteExpense(id);
        res.status(204).send();
    }

    async getAllExpenses(req: Request, res: Response, next: NextFunction) {
        const expensesService = ServiceFactory.getExpensesService(req.context);

        if (!req.context.currentUser) {
            throw new Error('Unauthorized');
        }

        const result = await expensesService.getAllExpenses(req.context.currentUser.id);
        res.status(200).json(result);
    }

    async notifyTenant(req: Request, res: Response, next: NextFunction) {
        const expensesService = ServiceFactory.getExpensesService(req.context);
        const { id } = req.params;
        const { message } = req.body;

        if (!req.context.currentUser) {
            throw new Error('Unauthorized');
        }

        const result = await expensesService.notifyTenant(id, message, req.context.currentUser.id);
        res.status(200).json(result);
    }
}

export const expensesController = new ExpensesController();
