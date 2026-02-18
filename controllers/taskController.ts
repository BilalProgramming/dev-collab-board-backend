import taskModel from "../models/task";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

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
export { createTask, getTaskByProjectId, updateTask }