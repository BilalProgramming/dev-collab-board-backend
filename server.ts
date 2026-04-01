require("dotenv").config()//load env
import app from "./app";
import { connectDb } from "./config/db";
const PORT=process.env.PORT
const startServer=async()=>{
try{
   await connectDb.getConnection()
    console.log('mysql connected');
    

}catch(error){
    console.log('failed to connect mysql',error);
    
}
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT} port`);
    
})
}

startServer()