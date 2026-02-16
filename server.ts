require("dotenv").config()//load env
import app from "./app";
import connectDb from "./config/db";

const PORT=process.env.PORT
connectDb()
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT} port`);
    
})