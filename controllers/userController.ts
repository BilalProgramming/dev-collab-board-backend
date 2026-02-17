import userModel from "../models/User";
import blackListModal from "../models/blackListToken";
import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const secretKey=process.env.SECRETKEY

const userSignup=expressAsyncHandler(async(req,resp)=>{
   
        const errors=validationResult(req)
          if (!errors.isEmpty())
    return resp.status(422).json({ errors: errors.array() });
 try{
        const {name,email,password}=req?.body
      
        // check if email already exists
       const alreadyExists=await userModel.findOne({email})
       if(alreadyExists){
         return resp.status(400).json({message:'Email Already Exists'})

       }
       const hashPassword=await bcrypt.hash(password,10)
       const newUser=new userModel({name,email,password:hashPassword})
     const data=  await newUser.save()
    
     

      resp.status(200).json({msg:'user register successfully',data})

    }catch(error){
        console.log('error',error);
        
        resp.status(500).json({status:false,message:'Servor error',error})

    }
})

const userLogin=expressAsyncHandler(async(req,resp)=>{
    try{
        const {email,password}=req?.body
        if(!email){
            return resp.status(422).json({status:422,message:'Email Field is Required'})
        }
        if(!password){
            return resp.status(422).json({status:422,message:'Password Field is Required'})
        }
        const findUser=await userModel.findOne({email})   
        
        
        if(!findUser){
            return resp.status(422).json({status:422,message:'Email does not exist'})

        }
        const storedPassword=findUser?.password 
        const isPassword=await bcrypt.compare(password,storedPassword )
          if(!isPassword){
                 return resp.status(422).json({status:422,message:'Invalid Credentials'})
            }
            const user=findUser.toObject()
            delete user.password
            delete user.__v
           const token=jwt.sign({user},secretKey,{expiresIn:'1d'})
         
              return resp.status(200).json({status:200,message:'Login successful',data:{token,user}})


    }catch(error){

    }


})

const userLogout=expressAsyncHandler(async(req,resp)=>{
    try{
        const token=req?.headers?.authorization?.split(' ')[1]
        if(!token)
        {
            return resp.status(400).json({status:400,message:'Token is missing'})
        }
        const decoded=jwt.verify(token,secretKey)
       
        
        const tokenIsBlackList=await blackListModal.findOne({token})
        if (tokenIsBlackList) {
    return resp.status(401).json({
      status: 401,
      message: "Already logged out",
    });
  }

       const newData= new blackListModal({token, expiresAt: new Date(decoded.exp * 1000),})
       await newData.save()
         return resp.status(200).json({status:200,message:'Logout Successfullly'})

    }catch(error){
          return resp.status(400).json({status:400,message:'Unauthenticated.',error})

    }
})

const currentUserInfo=expressAsyncHandler(async(req,resp)=>{
    try{
        const token=req?.headers.authorization?.split(' ')[1]
          if(!token)
        {
            return resp.status(400).json({status:400,message:'Token is missing'})
        }
        const tokenIsBlackList=await blackListModal.findOne({token})
          if (tokenIsBlackList) {
    return resp.status(401).json({
      status: 401,
      message: "Token is invalid",
    });
  }
        const decoded=jwt.verify(token,secretKey)
        return resp.status(200).json({status:200,message:'authenticated user',data:decoded})


    }catch(error){
         return resp.status(400).json({status:400,message:'Unauthenticated.',error})

    }

})


export {userSignup,userLogin,userLogout,currentUserInfo}