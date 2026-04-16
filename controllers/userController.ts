import userModel from "../models/user";
import blackListModal from "../models/blackListToken";
import expressAsyncHandler from "express-async-handler";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { createTenant } from "../Services/tenantService";
import { tenantModel } from "../models/tenant";

const secretKey = process.env.SECRETKEY

const userSignup = expressAsyncHandler(async (req: Request, resp: Response) => {
  let tenantId;

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    resp.status(422).json({ errors: errors.array() });
    return
  }
  
  try {
    const { name, email, password, company } = req?.body

    // check if email already exists
    const alreadyExists = await userModel.findOne({ email })
    if (alreadyExists) {
      resp.status(400).json({ message: 'Email Already Exists' })
      return

    }
    //  create tenant
    const newTenant = await createTenant({ name: company })
    if (!newTenant) {
      resp.status(500).json({ message: 'Failed to create tenant' })
      return
    }
    //register user
     tenantId = newTenant?._id
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = new userModel({ name, email, password: hashPassword, tenantId })

    const data = await newUser.save()
    const userResponse=data.toObject()
    delete userResponse.password 
    
    //update owner in tenant table
    await tenantModel.findOneAndUpdate(
      { _id: tenantId },
      { $set: { ownerId: newUser?._id } }
    )

    resp.status(200).json({ msg: 'user register successfully', data:userResponse })

  } catch (error) {
    //Rollback if user can't register
    if(tenantId){
    await tenantModel.findByIdAndDelete(tenantId)
    }

    resp.status(500).json({ status: false, message: 'Servor error', error })

  }
})

const userLogin = expressAsyncHandler(async (req: Request, resp: Response) => {
  try {
    const { email, password } = req?.body
    if (!email) {
      resp.status(422).json({ status: 422, message: 'Email Field is Required' })
      return
    }
    if (!password) {
      resp.status(422).json({ status: 422, message: 'Password Field is Required' })
      return
    }
    const findUser = await userModel.findOne({ email })


    if (!findUser) {
      resp.status(422).json({ status: 422, message: 'Email does not exist' })
      return

    }
    const userId=findUser?._id 
    const findTenant=await tenantModel.findOne({ownerId:userId})
    console.log('findTenant',findTenant);
    const storedPassword = findUser?.password
    const isPassword = await bcrypt.compare(password, storedPassword)
    if (!isPassword) {
      resp.status(422).json({ status: 422, message: 'Invalid Credentials' })
      return
    }
    let user = findUser.toObject() as any
    delete user.password
    delete user.__v
    user.tenantId=findTenant?._id
    if (!secretKey) {
      throw new Error("JWT secret is not defined!");
    }

    const token = jwt.sign({ user }, secretKey, { expiresIn: '1d' })

    resp.status(200).json({ status: 200, message: 'Login successful', data: { token, user } })


  } catch (error) {
    resp.status(500).json({ status: 500, message: 'Server Error', error })

  }


})

const userLogout = expressAsyncHandler(async (req: Request, resp: Response) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1]
    if (!token) {
      resp.status(400).json({ status: 400, message: 'Token is missing' })
      return
    }
    if (!secretKey) {
      throw new Error("JWT secret is not defined!");
    }

    const decoded = jwt.verify(token, secretKey) as { user: { _id: string; name: string; email: string }, exp: number };


    const tokenIsBlackList = await blackListModal.findOne({ token })
    if (tokenIsBlackList) {
      resp.status(401).json({
        status: 401,
        message: "Already logged out",
      });
      return
    }

    const newData = new blackListModal({ token, expiresAt: new Date(decoded.exp * 1000), })
    await newData.save()
    resp.status(200).json({ status: 200, message: 'Logout Successfullly' })

  } catch (error) {
    resp.status(400).json({ status: 400, message: 'Unauthenticated.', error })

  }
})

const currentUserInfo = expressAsyncHandler(async (req: Request, resp: Response) => {
  try {
    const token = req?.headers.authorization?.split(' ')[1]
    if (!token) {
      resp.status(400).json({ status: 400, message: 'Token is missing' })
      return
    }
    const tokenIsBlackList = await blackListModal.findOne({ token })
    if (tokenIsBlackList) {
      resp.status(401).json({
        status: 401,
        message: "Token is invalid",
      });
      return

    }
    if (!secretKey) {
      throw new Error("JWT secret is not defined!");
    }

    const decoded = jwt.verify(token, secretKey)
    resp.status(200).json({ status: 200, message: 'authenticated user', data: decoded })
    return


  } catch (error) {
    resp.status(400).json({ status: 400, message: 'Unauthenticated.', error })

  }

})


export { userSignup, userLogin, userLogout, currentUserInfo }