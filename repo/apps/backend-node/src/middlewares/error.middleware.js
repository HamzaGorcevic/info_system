import { z } from 'zod';
export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    if (err instanceof z.ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.issues
        });
    }
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        error: message
    });
};
