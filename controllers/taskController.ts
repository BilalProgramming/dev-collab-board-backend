
import taskModel from "../models/task";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import userModel from "../models/user";
import { AuthRequest } from "../types/auth.types";
import { Response } from "express";
import projectModel from "../models/project";

const createTask = expressAsyncHandler(async (req:AuthRequest, resp:Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
         resp.status(422).json({ errors: errors.array() });
        return;
    }
    try {
        const userId = req.user?._id
        const { title, description, status, projectId } = req?.body
        const findProject=await projectModel.findOne({_id:projectId,owner:userId})
       
        
        if(!findProject){
             resp.status(404).json({status:404,msg:'Project not found'})
             return;
        }
        const newTask = new taskModel({ title, description, status, projectId, createdBy: userId })
        await newTask.save()

        resp.status(200).json({ status: 200, msg: 'Task created succesfully', data: newTask })
        return;
    } catch (error) {
           resp.status(500).json({ status: 500, msg: 'Failed to create Task', errors: error })
           return;

    }


})
const getTaskByProjectId = expressAsyncHandler(async (req:AuthRequest, resp:Response) => {
    const id = req?.params.id as string
    if (!mongoose.Types.ObjectId.isValid(id)) {
        resp.status(400).json({
            status: 400,
            msg: "Invalid project ID"
        });
        return
    }

    try {
        const taskByProjectId = await taskModel.find({ projectId: id,createdBy:req?.user?._id }).populate('assignedTo', 'name email')
        if(taskByProjectId.length === 0) {
             resp.status(404).json({ status: 404, msg: 'No Tasks found for this project' })
             return;
        }

         resp.status(200).json({ status: 200, msg: 'Tasks fetched successfully', data: taskByProjectId })
         return;

    } catch (error) {
         resp.status(500).json({ status: 500, msg: 'Failed to fetch Tasks', errors: error })
         return;

    }
})
const updateTask = expressAsyncHandler(async (req:AuthRequest, resp:Response) => {
    
    const id = req.params?.id as string
    if (!mongoose.Types.ObjectId.isValid(id)) {
         resp.status(400).json({
            status: 400,
            msg: "Invalid project ID"
        });
        return;
    }

    try {
        const updatedTask=await taskModel.findOneAndUpdate(
            {_id:id,createdBy:req?.user?._id},
            {$set:req?.body},
            {new:true,runValidators:true}
        )
        /* const updatedTask = await taskModel.findByIdAndUpdate(
            id, { $set: req?.body },
            { new: true, runValidators: true }) */
        if (!updatedTask) {
        resp.status(404).json({ message: "Task not found" });
        return;

        }
        resp.status(200).json({ status: 200, message: 'Task updated succesfully', data: updatedTask })
        return;
    } catch (error) {
         resp.status(500).json({ status: 500, msg: 'Failed to update Task', errors: error })
         return;

    }
})

const updateTaskStatus=expressAsyncHandler(async(req:AuthRequest,resp:Response)=>{
      const id = req.params?.id as string
    if (!mongoose.Types.ObjectId.isValid(id)) {
         resp.status(400).json({
            status: 400,
            msg: "Invalid project ID"
        });
        return
    }
    try{ 
         const allowedStatuses = ["todo", "in-progress", "done"];
        const {status:taskStatus}=req?.body
  if (!allowedStatuses.includes(taskStatus)) {
    resp.status(400).json({
      message: "Invalid status value",
    });
    return
  }

      const result=await taskModel.findOneAndUpdate(
        {_id:id,createdBy:req.user?._id},
        {status:taskStatus},
        {new:true}
      )
      if(!result){
         resp.status(403).json({status:403,msg:'Failed to update Project'})
            return;

      }
    
        resp.status(200).json({status:200,msg:'status updated successfully',data:result})

    }catch(error){
        
      resp.status(500).json({status:500,msg:'Failed to update Stats',errors:error})
    }
})

const assignTaskToUser=expressAsyncHandler(async(req:AuthRequest,resp:Response)=>{
     const id = req.params?.id as string
       const{assignedTo}=req?.body
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(assignedTo)) {
         resp.status(400).json({
            status: 400,
            msg: "Invalid  ID"
        });
        return
    }
    try{       
        const findUser=await userModel.findById(assignedTo)
        if(!findUser){
             resp.status(404).json({status:404,msg:'user not found'})
             return;
        }
      
        
        const assignToUser=await taskModel.findOneAndUpdate(
            {_id:id,createdBy:req?.user?._id},
            {assignedTo},
            {new:true}
        )
        if(!assignToUser){
                resp.status(403).json({status:403,msg:'Forbidden',})
                return

        }
        resp.status(200).json({status:200,msg:'Task assign succesfully',data:assignToUser})
        return;


    }catch(error){
           resp.status(500).json({status:500,msg:'Failed To assign',errors:error})

    }
})

const deleteTask=expressAsyncHandler(async(req:AuthRequest,resp:Response)=>{
    const id=req.params?.id as string
     if (!mongoose.Types.ObjectId.isValid(id)) {
         resp.status(400).json({
            status: 400,
            msg: "Invalid project ID"
        });
        return
    }
    try{
        const deletedTask=await taskModel.findOneAndDelete({_id:id,createdBy:req?.user?._id})
            if(!deletedTask){
                resp.status(404).json({status:404,msg:'Task not found',})
                return
          }
           resp.status(200).json({status:200,msg:'Task deleted successfully', data:deletedTask})
           return

    }catch(error){
         resp.status(500).json({status:500,msg:'Error While Deleting Task',errors:error})
         return;

    }
})
export { createTask, getTaskByProjectId, updateTask,deleteTask ,updateTaskStatus,assignTaskToUser}