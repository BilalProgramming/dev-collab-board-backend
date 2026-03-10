
import projectModel from "../models/project";

interface CreateProjectDTO{
    name:string,
    description:string,
    owner:string

}

export const createProjectService=async(data:CreateProjectDTO)=>{
  const newProject=  new projectModel({name:data.name,description:data.description,owner:data.owner})
  const result= await newProject.save()
  return result

}