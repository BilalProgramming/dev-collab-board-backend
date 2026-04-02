import taskModel from "../models/task";
import projectModel from "../models/project";
import userModel from "../models/user";
import { connectDb } from "../config/db";

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
    taskStatus: "todo" | "in-progress" | "done"

}
interface assignTaskToUserDTO {
    id: string
    assignedTo: string,
    createdBy: string,


}
interface deleteTaskDTO {
    id: string
    createdBy: string,

}
export const createTaskService = async (data: CreateTaskDTO) => {

    let findProjectQuery = `SELECT * FROM projects WHERE id = ? AND owner_id = ?`
    let params = [data.projectId, data.owner]
    const [findProject] = await connectDb.execute(findProjectQuery, params)
    if ((findProject as any[]).length === 0) {
        throw new Error('Project not found')
    }
    let createTaskQuery=`INSERT INTO tasks(title,description,status,projectId,createdBy) VALUES(?,?,?,?,?)`
    let taskParams: any[] = [data.title, data.description, data.status , data.projectId, data.createdBy]
    const [result]=await connectDb.execute(createTaskQuery,taskParams)
    const insertedId = (result as any).insertId; // OkPacket typecast

    return {
        id: insertedId,
        title: data.title,
        description: data.description,
        status: data.status,
        project_id: data.projectId,
        created_by: data.createdBy
    };

    
   

}

export const getTaskByProjectIdService = async (data: GetTaskByProjectIdDTO) => {
    let query=`SELECT * FROM tasks WHERE projectId = ? AND  createdBy = ?`
    let params:any []=[data.projectId,data.createdBy]
    const [taskByProjectId] = await connectDb.execute(query, params)
    if ((taskByProjectId as any[]).length  === 0) {
        throw new Error('No Tasks found for this project')



    }
    return taskByProjectId

}
export const updateTaskService = async (data: UpdateTaskDTO) => {
    let query=`UPDATE tasks SET title = ?, description = ?, status = ?, projectId = ? WHERE id = ? AND createdBy = ?`
    let params:any[]=[data.body.title, data.body.description, data.body.status, Number(data.body.projectId), data.id, data.createdBy]
    const [result]=await connectDb.execute(query,params)
    if((result as any).affectedRows === 0){
        throw new Error('Task not found or no changes made')
    }
    return {
        id: data.id,
        title: data.body.title,
        description: data.body.description,
        status: data.body.status,
        project_id: data.body.projectId,
        created_by: data.createdBy
    }

  
}
export const updateTaskStatusService = async (data: UpdateTaskStatusDTO) => {

    const result = await taskModel.findOneAndUpdate(
        { _id: data.id, createdBy: data.createdBy },
        { status: data.taskStatus },
        { new: true }
    )
    if (!result) {
        throw new Error('Task not found ')
    }
    return result

}
export const assignTaskToUserService = async (data: assignTaskToUserDTO) => {
    let findUserQuery = `SELECT * FROM users WHERE id = ?`
    let params = [data.assignedTo]
    const [findUser] = await connectDb.execute(findUserQuery, params)
    if (!findUser || (findUser as any[]).length === 0) {
        throw new Error('user not foud')
    }
    let assignTaskQuery=`UPDATE tasks SET assignedTo = ? WHERE id = ? AND createdBy = ?`
    let assignTaskParams:any[]=[data.assignedTo, data.id, data.createdBy]
    const [assignToUser]:any=await connectDb.execute(assignTaskQuery,assignTaskParams)

    if (assignToUser.affectedRows === 0) {
        throw new Error('Task not found or forbidden');
    }
    const fetchTask=`SELECT * FROM tasks WHERE id = ?`
    const [result]=await connectDb.execute(fetchTask,[data.id])
    return result[0]




}
export const deleteTaskService = async (data: deleteTaskDTO) => {
    //find tasks
     let deletedTasksQuery=`SELECT * FROM tasks WHERE id = ? AND createdBy = ?`
    const deletedTasks=await connectDb.execute(deletedTasksQuery,[data.id,data.createdBy])
    let query=` DELETE FROM tasks WHERE id = ? AND createdBy = ?`
    let params:any[]=[data.id, data.createdBy]
    const [result]:any=await connectDb.execute(query,params)
    if (result.affectedRows === 0) {
        throw new Error('Task not found or forbidden');
    }
   
    return deletedTasks[0]





}