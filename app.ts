import express from 'express'
import userRoutes from './routes/userRoutes'
import projectRoutes from './routes/projectRoutes'
import taskRoutes from './routes/taskRoutes'

const app=express()
app.use(express.json())
app.use('/api/auth',userRoutes)
app.use('/api',projectRoutes)
app.use('/api',taskRoutes)


export default app