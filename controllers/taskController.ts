
import taskModel from "../models/task";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import userModel from "../models/user";
import { AuthRequest } from "../types/auth.types";
import { Response } from "express";
import projectModel from "../models/project";
import { assignTaskToUserService, createTaskService, deleteTaskService, getTaskByProjectIdService, updateTaskService, updateTaskStatusService } from "../Services/taskService";

const createTask = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        resp.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const userId = req.user?.id
        if (!userId) {
            resp.status(401).json({ status: 401, msg: 'user not found' })
            return
        }
        const { title, description, status, projectId } = req?.body
        const newTask = await createTaskService({ projectId, owner: userId, title, description, status, createdBy: userId })
        console.log(newTask);
        
        

        resp.status(201).json({ status: 200, msg: 'Task created succesfully', data: newTask })
        return;
    } catch (error: any) {
        console.log('error', error);

        resp.status(error.message === "Project not found" ? 404 : 500).json({
            status: error.message === "Project not found" ? 404 : 500,
            msg: error.message || "Failed to create Task",
        })
        //    resp.status(500).json({ status: 500, msg: 'Failed to create Task', errors: error })
        return;

    }


})
const getTaskByProjectId = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
    const id = req?.params.id as string
   
    if (!req?.user?.id) {
        resp.status(401).json({ status: 401, msg: 'User Not Found' })
        return
    }

    try {
        const result = await getTaskByProjectIdService({ projectId: id, createdBy: req?.user?.id })
       
        resp.status(200).json({ status: 200, msg: 'Tasks fetched successfully', data: result })
        return;

    } catch (error: any) {
        if (error.message === 'No Tasks found for this project') {
            resp.status(404).json({
                status: 404,
                msg: error.message
            })
            return
        }

        resp.status(500).json({
            status: 500,
            msg: 'Failed to fetch Tasks'
        })
    }
})
const updateTask = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {

    const id = req.params?.id as string
   
    if (!req.user?.id) {
        resp.status(401).json({
            message: "User Not Found",
        });
        return
    }

    try {


        const { _id, createdAt, updatedAt, ...safeBody } = req.body

        const updatedTask = await updateTaskService({ id, createdBy: req?.user?.id, body: safeBody })
      
        resp.status(200).json({ status: 200, message: 'Task updated succesfully', data: updatedTask })
        return;
    } catch (error: any) {
      
        
        if (error.message === "Task not found") {
            resp.status(404).json({
                status: 404,
                msg: error.message
            })
            return
        }

        resp.status(500).json({
            status: 500,
            msg: "Failed to update Task"
        })
        return
    }
})

const updateTaskStatus = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
    const id = req.params?.id as string
    if (!mongoose.Types.ObjectId.isValid(id)) {
        resp.status(400).json({
            status: 400,
            msg: "Invalid Task ID"
        });
        return
    }
    if (!req.user?._id) {
        resp.status(401).json({
            message: "User Not Found",
        });
        return
    }
    try {
        const allowedStatuses = ["todo", "in-progress", "done"];
        const { status: taskStatus } = req?.body
        if (!allowedStatuses.includes(taskStatus)) {
            resp.status(400).json({
                message: "Invalid status value",
            });
            return
        }
        const result = await updateTaskStatusService({ id, createdBy: req.user?._id, taskStatus })


        /*  const result = await taskModel.findOneAndUpdate(
             { _id: id, createdBy: req.user?._id },
             { status: taskStatus },
             { new: true }
         )
         */

        resp.status(200).json({ status: 200, msg: 'status updated successfully', data: result })

    } catch (error: any) {
        if (error.message === "Task not found") {
            resp.status(404).json({
                status: 404,
                msg: error.message
            })
            return
        }


        resp.status(500).json({
            status: 500,
            msg: "Failed to update Status"
        })
    }
})

const assignTaskToUser = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
    const id = req.params?.id as string
    const { assignedTo } = req?.body
   
    if(!req?.user?.id){
         resp.status(401).json({
            status: 401,
            msg: "User not exist"
        });
        return

    }
    try {
        const result=await assignTaskToUserService({assignedTo,id, createdBy: req?.user?.id})
      
        resp.status(200).json({ status: 200, msg: 'Task assign succesfully', data: result })
        return;


    } catch (error) {
        resp.status(500).json({ status: 500, msg: 'Failed To assign', errors: error })

    }
})

const deleteTask = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
    const id = req.params?.id as string
   
    if(!req?.user?.id){
         resp.status(401).json({
            status: 401,
            msg: "User Not Found"
        });
        return



    }
    try {
        const deletedTask=await deleteTaskService({id,createdBy: req?.user?.id})
        resp.status(200).json({ status: 200, msg: 'Task deleted successfully', data: deletedTask })
        return

    } catch (error) {
        console.log(error);
        
        resp.status(500).json({ status: 500, msg: 'Error While Deleting Task', errors: error })
        return;

    }
})
export { createTask, getTaskByProjectId, updateTask, deleteTask, updateTaskStatus, assignTaskToUser }