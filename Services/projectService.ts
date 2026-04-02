
import projectModel from "../models/project";
import { connectDb } from "../config/db";
import { OkPacket } from "mysql2";


interface CreateProjectDTO { // Data transfer object
    name: string,
    description: string,
    owner: string

}
interface GetProjectListDTO {
    per_page: number,
    skip: number,
    id: number,
    search:string

}
interface showProjectListDTO {
    id: string,
    owner: string
}
interface projectUpdateBodyDTO {
    name: string,
    description: string,

}
interface updateProjectSericeDTO {
    projectId: string,
    owner: string,
    body: projectUpdateBodyDTO

}
interface deleteProjectSericeDTO {
    id: string,
    owner: string

}


export const createProjectService = async (data: CreateProjectDTO) => {
    const query = `INSERT INTO projects(name,description,owner_id) VALUES(?,?,?)`
    const [result] = await connectDb.execute(query, [data.name, data.description, data.owner])

    const insertedId = (result as any).insertId; // OkPacket typecast

    return {
        id: insertedId,
        name: data.name,
        description: data.description,
        owner_id: data.owner,
    };

}

export const getProjectListService = async (data: GetProjectListDTO) => {
    const ownerId = Number(data.id);
    const perPage = Number(data.per_page);
    const skip = Number(data.skip);
    const search=data.search.trim() || ''

    let query=`SELECT * FROM projects WHERE  owner_id = ?`
    let params:any[]=[ownerId]

    if(search){
        query+=` AND ( name LIKE ? OR id = ? OR owner_id = ?)`
        params.push(`%${search}%`,Number(search), Number(search))
    }
    query += ` LIMIT ${perPage} OFFSET ${skip}`;
   
    const [projects]=await connectDb.execute(query,params)

    return projects

    
}

export const showProjectListService = async (data: showProjectListDTO) => {
    let query=`SELECT * FROM projects WHERE owner_id = ?  AND id = ?`
    let params:any[]=[data.owner, data.id]
    const [projects]=await connectDb.execute(query,params)
    return projects
   


}
export const updateProjectService = async (data: updateProjectSericeDTO) => {
    let query=`UPDATE projects SET name = ?, description = ? WHERE id = ? AND owner_id = ?`
    let params:any[]=[data.body.name, data.body.description, data.projectId, data.owner]
    const [result]=await connectDb.execute(query,params) 
    const updatedProjects={
        id: data.projectId,
        name: data.body.name,
        description: data.body.description,
        owner_id: data.owner
    }   
    return updatedProjects


}

export const deleteProjectService = async (data: deleteProjectSericeDTO) => {
    let query=` DELETE FROM projects WHERE id = ? AND owner_id = ?`
    let params:any[]=[data.id, data.owner]
    const [result]=await connectDb.execute<OkPacket>(query,params) 
      if (result.affectedRows === 0) {
        return null; 
    }

    
    const deletedProject={
        id: data.id,
        owner_id: data.owner
    }
    return deletedProject
 

}