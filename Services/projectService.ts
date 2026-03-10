
import projectModel from "../models/project";

interface CreateProjectDTO {
    name: string,
    description: string,
    owner: string

}
interface GetProjectListDTO {
    per_page: number,
    skip: number,
    id: string,

}

export const createProjectService = async (data: CreateProjectDTO) => {
    const newProject = new projectModel({ name: data.name, description: data.description, owner: data.owner })
    const result = await newProject.save()
    return result

}

export const getProjectListService = async (data: GetProjectListDTO) => {
    const projects = await projectModel.find({ owner: data.id })
    .skip(data.skip)
    .limit(data.per_page)
    .exec()

    return projects

}