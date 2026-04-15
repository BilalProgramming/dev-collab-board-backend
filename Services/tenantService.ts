import { tenantModel } from "../models/tenant";

interface CreateTenantDTO {
     name:string,
     ownerId: string
  
}

export const createTenant=async(data:CreateTenantDTO)=>{
//check if tenent already exist

const newTenant=await tenantModel.create({name:data.name})
return newTenant
 
}