import jwt from 'jsonwebtoken'
const secretKey=process.env.SECRETKEY
import blackListModal from '../models/blackListToken'
export const authMiddleware=async(req,resp,next)=>{
     const token=req?.headers?.authorization?.split(' ')[1]
     if(!token){      
           return resp.status(401).json({status:401,message:'Token is missing'})
        
     }
    try{

        const decoded=jwt.verify(token,secretKey)
          const tokenIsBlackList=await blackListModal.findOne({token})
            if (tokenIsBlackList) {
    return resp.status(401).json({
      status: 401,
      message: "unauthorized",
    });
  }
        req.user=decoded.user
        next()

    }catch(error){
         return resp.status(401).json({status:401,message:'unauthorized'})


    }

}