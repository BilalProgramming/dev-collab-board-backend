import mongoose,{Schema} from "mongoose";

export interface IToken{
    token:string,
    expiresAt:Date

}
 const blackListSchema=new Schema<IToken>({
    token:{
        type:String,
        required:true

    },
    expiresAt:{
        type:Date,
        required:true,
        default:Date.now

    }

 })
// auto delete after expire date is reached
 blackListSchema.index({expiresAt:1},{expireAfterSeconds:0})
 const blackListModal=mongoose.model<IToken>('BlacklistToken',blackListSchema)
 export default blackListModal

