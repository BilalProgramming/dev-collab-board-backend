import jwt from 'jsonwebtoken'
const secretKey=process.env.SECRETKEY
import blackListModal from '../models/blackListToken'
import { NextFunction,Response } from 'express'
import { AuthRequest } from '../types/auth.types'
export const authMiddleware=async(req:AuthRequest,resp:Response,next:NextFunction)=>{
     const token=req?.headers?.authorization?.split(' ')[1]
     if(!token){      
           resp.status(401).json({status:401,message:'Token is missing'})
        return
     }
    try{
      if (!secretKey) {
   throw new Error("JWT secret is not defined!");
}

        const decoded=jwt.verify(token,secretKey) as { user: { _id: string;name:string; email: string } };
          const tokenIsBlackList=await blackListModal.findOne({token})
            if (tokenIsBlackList) {
     resp.status(401).json({
      status: 401,
      message: "unauthorized",
    });
    return
  }
        req.user=decoded.user
        next()

    }catch(error){
         return resp.status(401).json({status:401,message:'unauthorized'})


    }

}