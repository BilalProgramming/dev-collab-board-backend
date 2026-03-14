import taskModel from "../models/task";
import projectModel from "../models/project";
import userModel from "../models/user";

interface CreateTaskDTO {
    projectId: string
    owner: string
    title: string
    description: string
    status?: "todo" | "in-progress" | "done"
    createdBy: string
    assignedTo?: string
}
interface GetTaskByProjectIdDTO {
    projectId: string
    createdBy: string

}
export interface UpdateTaskBodyDTO {
    title: string
    description: string
    status: "todo" | "in-progress" | "done"
    projectId: string
}
interface UpdateTaskDTO {
    id: string
    createdBy: string,
    body: UpdateTaskBodyDTO

}
interface UpdateTaskStatusDTO {
    id: string
    createdBy: string,
    taskStatus:"todo" | "in-progress" | "done"

}
interface assignTaskToUserDTO {
    id: string
    assignedTo: string,
     createdBy: string,
    

}
interface deleteTaskDTO{
      id: string
     createdBy: string,

}
export const createTaskService = async (data: CreateTaskDTO) => {


    const findProject = await projectModel.findOne({ _id: data.projectId, owner: data.owner })
    if (!findProject) {
        throw new Error('Project not found')

    }
    return await taskModel.create({ title: data.title, description: data.description, status: data.status, projectId: data.projectId, createdBy: data.createdBy })
    // await newTask.save()
    // return newTask

}

export const getTaskByProjectIdService = async (data: GetTaskByProjectIdDTO) => {
    const taskByProjectId = await taskModel.find({ projectId: data.projectId, createdBy: data.createdBy }).populate('assignedTo', 'name email')
    if (taskByProjectId.length === 0) {
        throw new Error('No Tasks found for this project')



    }
    return taskByProjectId

}
export const updateTaskService = async (data: UpdateTaskDTO) => {
    
    const result = await taskModel.findOneAndUpdate(
        { _id: data.id, createdBy: data.createdBy },
        { $set: data.body },
        { new: true, runValidators: true }
    )
    if (!result) {
        throw new Error("Task not found")


    }
    return result

}
export const updateTaskStatusService = async (data: UpdateTaskStatusDTO) => {
    
    const result=await taskModel.findOneAndUpdate(
         { _id: data.id, createdBy: data.createdBy },
             { status: data.taskStatus },
             { new: true }
    )
     if (!result) {
       throw new Error('Failed to update Task')
         } 
         return result

}
export const assignTaskToUserService = async (data: assignTaskToUserDTO) => {
    const findUser=await userModel.findById(data.assignedTo)
     if (!findUser) {
          throw new Error('user not foud')
        }
         const assignToUser = await taskModel.findOneAndUpdate(
                    { _id: data.id, createdBy: data.createdBy },
                    { $set:{assignedTo:data.assignedTo} },
                    { new: true }
                )
                if (!assignToUser) {
                    throw new Error('Forbidden')
        
                }
                return assignToUser

    
    

}
export const deleteTaskService = async (data: deleteTaskDTO) => {
    const deletedTask=await taskModel.findOneAndDelete(
        {_id: data.id, createdBy:data.createdBy}
    )
      if (!deletedTask) {
           throw new Error('Task not found')
        } 
         return deletedTask
  

    
    

}