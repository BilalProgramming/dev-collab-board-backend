import projectModel from "../models/project";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";

import mongoose from "mongoose";

const secretKey = process.env.SECRETKEY
const createProject = expressAsyncHandler(async (req, resp) => {
     const errors = validationResult(req)

     if (!errors.isEmpty())
          return resp.status(422).json({ errors: errors.array() });
     try {

          const userId = req?.user?._id

          const { name, description } = req?.body

          const newProject = new projectModel({ name, owner: userId, description })
          const data = await newProject.save()
          return resp.status(200).json({ status: false, msg: 'project created successfully', data })



     } catch (error) {
          return resp.status(500).json({ status: false, msg: 'Error while creating project', errors: error })

     }
})
const getProjectList = expressAsyncHandler(async (req, resp) => {
     const current_page = req.query.page || 1
     const per_page = req.query.per_page || 10
     const totalCount = await projectModel.countDocuments()
     const totalPages = Math.ceil(totalCount / per_page);  // Total pages
     const lastPage = Math.ceil(totalCount / per_page);
     const skip = (current_page - 1) * per_page
     try {

          const projects = await projectModel
               .find()
               .skip(skip)
               .limit(per_page)
               .exec()
          return resp.status(200).json({
               status: 200, message: 'project list retrived successfully', data: projects, meta: {
                    totalCount,
                    totalPages, current_page, per_page, lastPage
               }
          })


     } catch (error) {
          return resp.status(500).json({ status: false, message: 'Error While Fetching Projects', errors: error })

     }
})

const showProject = expressAsyncHandler(async (req, resp) => {
     try {
          const id = req.params?.id
          if (id) {
               const projects = await projectModel.findById(id)
               console.log('projects', projects);
               if (!projects) {

                    return resp.status(404).json({
                         status: 404,
                         message: 'Project not found'
                    });
               }


               return resp.status(200).json({
                    status: 200, message: 'project list retrived successfully', data: projects
               })


          }

     } catch (error) {
          return resp.status(500).json({
               status: 500, message: 'Failed to fetch Projects', errors: error
          })


     }
})

const updateProject = expressAsyncHandler(async (req, resp) => {
     try {
          const projectId = req.params.id
          const updatedProject = await projectModel.findByIdAndUpdate(
               projectId,
               { $set: req?.body },
               { new: true, runValidators: true }
          )
          if (!updatedProject) {
               return resp.status(404).json({ message: "Project not found" });

          }

          resp.status(200).json({status:200,message:'project updated succesfully',data:updatedProject})

     } catch (error) {
          return resp.status(500).json({ status: 500, msg: 'Failed to update Project', errors: error })

     }

})
const deleteProject=expressAsyncHandler(async(req,resp)=>{
     try{
          const id=req.params?.id
          if (!mongoose.Types.ObjectId.isValid(id)) {
     return resp.status(400).json({
          status: 400,
          msg: "Invalid project ID"
     });
}
          const deletedProject=await projectModel.findByIdAndDelete(id)
          

          if(!deletedProject){
               return resp.status(404).json({status:404,msg:'project not found',})
          }
          return resp.status(200).json({status:200,msg:'project deleted successfully', data:deletedProject})


     }catch(error){
          return resp.status(500).json({status:500,msg:'Failed to delete project',errors:error})

     }
})
export { createProject, getProjectList, showProject, updateProject,deleteProject }