import { response } from "express";
import taskModel from "../models/task";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import userModel from "../models/User";

const createTask = expressAsyncHandler(async (req, resp) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
        return resp.status(422).json({ errors: errors.array() });
    try {
        const userId = req.user?._id



        const { title, description, status, projectId } = req?.body
        const newTask = new taskModel({ title, description, status, projectId, createdBy: userId })
        await newTask.save()

        return resp.status(200).json({ status: 200, msg: 'Task created succesfully', data: newTask })



    } catch (error) {
          return resp.status(500).json({ status: 500, msg: 'Failed to create Task', errors: error })

    }


})
const getTaskByProjectId = expressAsyncHandler(async (req, resp) => {
    const id = req?.params.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return resp.status(400).json({
            status: 400,
            msg: "Invalid project ID"
        });
    }

    try {
        const taskByProjectId = await taskModel.find({ projectId: id })

        return resp.status(200).json({ status: 200, msg: 'Tasks fetched successfully', data: taskByProjectId })

    } catch (error) {
        return resp.status(500).json({ status: 500, msg: 'Failed to fetch Tasks', errors: error })

    }
})
const updateTask = expressAsyncHandler(async (req, resp) => {
    const id = req.params?.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return resp.status(400).json({
            status: 400,
            msg: "Invalid project ID"
        });
    }

    try {
        const updatedTask = await taskModel.findByIdAndUpdate(
            id, { $set: req?.body },
            { new: true, runValidators: true })
        if (!updatedTask) {
            return resp.status(404).json({ message: "Task not found" });

        }
        resp.status(200).json({ status: 200, message: 'Task updated succesfully', data: updatedTask })



    } catch (error) {
         return resp.status(500).json({ status: 500, msg: 'Failed to update Task', errors: error })

    }
})

const updateTaskStatus=expressAsyncHandler(async(req,resp)=>{
      const id = req.params?.id
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return resp.status(400).json({
            status: 400,
            msg: "Invalid project ID"
        });
    }
    try{ 
         const allowedStatuses = ["todo", "in-progress", "done"];
        const {status:taskStatus}=req?.body
  if (!allowedStatuses.includes(taskStatus)) {
    return resp.status(400).json({
      message: "Invalid status value",
    });
  }

      const result=await taskModel.findOneAndUpdate(
        {_id:id,createdBy:req.user?._id},
        {status:taskStatus},
        {new:true}
      )
      if(!result){
        return resp.status(403).json({status:403,msg:'Failed to update Project'})

      }
    
        resp.status(200).json({status:200,msg:'status updated successfully',data:result})

    }catch(error){
        console.log(error);
        
      resp.status(500).json({status:500,msg:'Failed to update Stats',errors:error})
    }
})

const assignTaskToUser=expressAsyncHandler(async(req,resp)=>{
     const id = req.params?.id
       const{assignedTo}=req?.body
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(assignedTo)) {
        return resp.status(400).json({
            status: 400,
            msg: "Invalid  ID"
        });
    }
    try{       
      /* 
        const findTask=await taskModel.findById(id)
        
         if(!findTask){
            return resp.status(404).json({status:404,msg:'Task not found'})
        } */
        const findUser=await userModel.findById(assignedTo)
        if(!findUser){
            return resp.status(404).json({status:404,msg:'user not found'})
        }
      
        
        const assignToUser=await taskModel.findOneAndUpdate(
            {_id:id,createdBy:req?.user._id},
            {assignedTo},
            {new:true}
        )
        if(!assignToUser){
               return resp.status(403).json({status:403,msg:'Forbidden',})

        }
        return resp.status(200).json({status:200,msg:'Task assign succesfully',data:assignToUser})


    }catch(error){
          return resp.status(500).json({status:500,msg:'Failed To assign',errors:error})

    }
})

const deleteTask=expressAsyncHandler(async(req,resp)=>{
    const id=req.params?.id
     if (!mongoose.Types.ObjectId.isValid(id)) {
        return resp.status(400).json({
            status: 400,
            msg: "Invalid project ID"
        });
    }
    try{
        const deletedTask=await taskModel.findByIdAndDelete(id)
            if(!deletedTask){
               return resp.status(404).json({status:404,msg:'Task not found',})
          }
          return resp.status(200).json({status:200,msg:'Task deleted successfully', data:deletedTask})

    }catch(error){
         return resp.status(500).json({status:500,msg:'Error While Deleting Task',errors:error})

    }
})
export { createTask, getTaskByProjectId, updateTask,deleteTask ,updateTaskStatus,assignTaskToUser}