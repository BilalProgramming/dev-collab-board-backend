import mongoose, { Schema } from "mongoose";

export interface ITenant{
    name:string,
     ownerId: mongoose.Types.ObjectId

}

const tenantSchema=new Schema<ITenant>({
    name:{
        type:String,required:true
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        default:null
    }

})

export const tenantModel=mongoose.model<ITenant>('Tenant',tenantSchema)