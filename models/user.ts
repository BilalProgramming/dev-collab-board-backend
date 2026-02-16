import mongoose ,{Schema}from "mongoose";

export interface IUser{
    name:string,
    email:string,
    password:string
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
    }
})

 const userModel=mongoose.model<IUser>('user',userSchema)
 export default userModel