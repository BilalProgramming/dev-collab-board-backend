import mongoose ,{Schema}from "mongoose";

export interface IUser{
    name:string,
    email:string,
    password:string,
    tenantId: mongoose.Types.ObjectId,
     company:string,
}
const userSchema=new Schema<IUser>({
    name:{
        type:String,required:true,
    },
    email:{
        type:String,required:true,unique:true
    },
    password:{
        type:String,required:true
    },
    tenantId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Tenant',
        required:true
    }

})

 const userModel=mongoose.model<IUser>('user',userSchema)
 export default userModel