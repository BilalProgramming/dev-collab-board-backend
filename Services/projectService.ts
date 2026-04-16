
import projectModel from "../models/project";

interface CreateProjectDTO { // Data transfer object
    name: string,
    description: string,
    owner: string,
    tenantId:string

}
interface GetProjectListDTO {
    per_page: number,
    skip: number,
    id: string,
    tenantId:string

}
interface showProjectListDTO{
    id:string,
    owner:string,
    tenantId:string
}
interface projectUpdateBodyDTO{
    name:string,
    description:string,

}
interface updateProjectSericeDTO{
    projectId:string,
    owner:string,
    tenantId:string,
    body:projectUpdateBodyDTO

}
interface deleteProjectSericeDTO{
    id:string,
    owner:string,
    tenantId:string

}


export const createProjectService = async (data: CreateProjectDTO) => {
    const newProject = new projectModel({ name: data.name, description: data.description, owner: data.owner ,tenantId:data.tenantId})
    const result = await newProject.save()
    return result

}

export const getProjectListService = async (data: GetProjectListDTO) => {
    const projects = await projectModel.find({ owner: data.id,tenantId:data.tenantId })
    .skip(data.skip)
    .limit(data.per_page)
    .exec()

    return projects

}

export const showProjectListService=async(data:showProjectListDTO)=>{
    const projects=await projectModel.findOne({_id:data.id,owner:data.owner,tenantId:data.tenantId})
    return projects


}
export const updateProjectService=async(data:updateProjectSericeDTO)=>{
    const updatedProject=await projectModel.findOneAndUpdate(
        {_id:data.projectId,owner:data.owner,tenantId:data.tenantId},
        {$set:data.body},
        {new:true,runValidators: true}
        
    )
    return updatedProject

}

export const deleteProjectService=async(data:deleteProjectSericeDTO)=>{
    const deletedProject=await projectModel.findOneAndDelete(
        {_id:data.id,owner:data.owner,tenantId:data.tenantId}
    )
  return deletedProject

}