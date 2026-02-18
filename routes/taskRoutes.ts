import { createTask,getTaskByProjectId,updateTask } from "../controllers/taskController";
import express from 'express'
import { createTaskValidator } from "../validators/taskValidator";
import { authMiddleware } from "../middleware/authMiddleware";


const router=express.Router()

router.post('/tasks',createTaskValidator,authMiddleware,createTask)
router.put('/tasks/:id',authMiddleware,updateTask)
router.get('/tasks/project/:id',authMiddleware,getTaskByProjectId)

export default router