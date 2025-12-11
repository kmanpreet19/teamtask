import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import routes from './routes'
import { errorMiddleware } from './middlewares/error.middleware'
import rateLimit from 'express-rate-limit'
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())

// global rate limiter for safety
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))

app.use('/api', routes)

app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }))

app.use(errorMiddleware)



app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

export default app
