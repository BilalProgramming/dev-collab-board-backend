import mongoose from "mongoose"
const MONGODB_URL=process.env.MONGODB_URL


const connectDb=async()=>{
    try{
      const resut=await  mongoose.connect(MONGODB_URL as string) 
      console.log('mongo db connected');
      

    }catch(error){
        console.log("error while connect to db",error);
        
        
    }
}
export default connectDb