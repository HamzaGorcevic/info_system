import "./pre-load-env.js"
import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
import morgan from "morgan"
import routes from "./src/routes/index.js"
import { errorHandler } from "./src/middlewares/error.middleware.js"

const app = express()

// Middleware
app.use(morgan("dev"))
app.use(cors())
app.use(express.json());

// Routes
app.use("/api", routes)

app.get("/", (req: Request, res: Response) => {
    res.send("API is running...")
})

// Error Handling
app.use(errorHandler)

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
    console.log(` Backend active at http://localhost:${port}`)
});

// Catch port-in-use or other startup errors
server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Error: Port ${port} is already being used by another program.`);
    } else {
        console.error(' Server Error:', err);
    }
    process.exit(1);
});

// Catch any other weird crashes
process.on('uncaughtException', (err) => {
    console.error(' Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
