import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.routes.js'
import mcqRoute from './routes/mcq.routes.js'
import { config } from 'dotenv'
import morgan from 'morgan'
import errorMiddleware from './middleware/error.middleware.js'
import adminRoutes from './routes/admin.routes.js'
config()

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(cookieParser())

app.use(morgan('dev'))

// routes
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/mcq', mcqRoute)
app.use('/api/v1/admin', adminRoutes)

app.get('/', (req, res) => {
    res.send('Welcome to MCQ API');
})

app.all('*', (req, res) => {
    res.status(404).send('OOPS! 404 page not found')
})

app.use(errorMiddleware);

export default app;