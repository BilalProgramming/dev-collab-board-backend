import express from 'express'
import userRoutes from './routes/userRoutes'
import projectRoutes from './routes/projectRoutes'

const app=express()
app.use(express.json())
app.use('/api/auth',userRoutes)
app.use('/api',projectRoutes)


export default app