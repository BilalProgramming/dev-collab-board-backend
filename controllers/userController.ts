import userModel from "../models/User";
import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

const scretKey=process.env.SECRETKEY

const userSignup=expressAsyncHandler(async(req,resp)=>{
   
        const errors=validationResult(req)
          if (!errors.isEmpty())
    return resp.status(422).json({ errors: errors.array() });
 try{
        const {name,email,password}=req?.body
      /*   if(!name || !email || !password){
            return resp.status(422).json({message:'All Fields are required'})
             
        } */
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
           const token=jwt.sign({user},scretKey,{expiresIn:'1d'})
         
              return resp.status(200).json({status:200,message:'Login successful',data:{token,user}})


    }catch(error){

    }


})


export {userSignup,userLogin}