
import projectModel from "../models/project";
import { connectDb } from "../config/db";
import { decodeBase64 } from "bcryptjs";

interface CreateProjectDTO { // Data transfer object
    name: string,
    description: string,
    owner: string

}
interface GetProjectListDTO {
    per_page: number,
    skip: number,
    id: number,

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

   
    const query = `SELECT * FROM projects WHERE owner_id=${ownerId} LIMIT ${perPage} OFFSET ${skip}`;
    const [findAllProjects] = await connectDb.execute(query);

    return findAllProjects;
}

export const showProjectListService = async (data: showProjectListDTO) => {
    const projects = await projectModel.findOne({ _id: data.id, owner: data.owner })
    return projects


}
export const updateProjectService = async (data: updateProjectSericeDTO) => {
    const updatedProject = await projectModel.findOneAndUpdate(
        { _id: data.projectId, owner: data.owner },
        { $set: data.body },
        { new: true, runValidators: true }

    )
    return updatedProject

}

export const deleteProjectService = async (data: deleteProjectSericeDTO) => {
    const deletedProject = await projectModel.findOneAndDelete(
        { _id: data.id, owner: data.owner }
    )
    return deletedProject

}