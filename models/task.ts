import mongoose, { Schema } from "mongoose";
export interface ITask {
    title: string,
    description: string,
    status:  "todo" | "in-progress" | "done"
    projectId: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId,
    assignedTo:mongoose.Types.ObjectId
    


}

const taskSchema = new Schema<ITask>({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['todo', 'in-progress', 'done'],
        required: true,
        default:'todo'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        default:null
    }


}, { timestamps: true })
const taskModel = mongoose.model<ITask>('task', taskSchema,)
export default taskModel
