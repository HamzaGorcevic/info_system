import { env } from "./src/config/env.js"
import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
import helmet from "helmet"
import { pinoHttp } from "pino-http"
import routes from "./src/routes/index.js"
import { errorHandler } from "./src/middlewares/error.middleware.js"
import { logger } from "./src/utils/logger.js"

const app = express()

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json());
app.use(pinoHttp({ logger }));

// Routes
app.use("/api", routes)

app.get("/", (req: Request, res: Response) => {
    res.send("API is running...")
})

app.use(errorHandler)

const port = env.PORT;

const server = app.listen(port, () => {
    logger.info(`Backend active at http://localhost:${port}`)
});

const shutdown = () => {
    logger.info('SIGTERM/SIGINT received. Shutting down gracefully...');
    server.close(() => {
        logger.info('Closed out remaining connections.');
        process.exit(0);
    });

    setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        logger.error(`Error: Port ${port} is already being used by another program.`);
    } else {
        logger.error({ err }, 'Server Error');
    }
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    logger.error({ err }, 'Uncaught Exception');
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error({ reason, promise }, 'Unhandled Rejection');
});

