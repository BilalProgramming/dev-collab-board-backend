import { createTask,getTaskByProjectId,updateTask,updateTaskStatus,assignTaskToUser,deleteTask } from "../controllers/taskController";
import express from 'express'
import { createTaskValidator } from "../validators/taskValidator";
import { authMiddleware } from "../middleware/authMiddleware";


const router=express.Router()

router.get('/tasks/project/:id',authMiddleware,getTaskByProjectId)
router.post('/tasks',createTaskValidator,authMiddleware,createTask)
router.patch('/tasks/:id/assign',authMiddleware,assignTaskToUser)
router.patch('/tasks/:id/status',authMiddleware,updateTaskStatus)
router.put('/tasks/:id',authMiddleware,updateTask)
router.delete('/tasks/:id',authMiddleware,deleteTask)

export default router