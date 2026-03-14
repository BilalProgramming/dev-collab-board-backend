import projectModel from "../models/project";
import expressAsyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { AuthRequest } from "../types/auth.types";
import { Response } from "express";
import { createProjectService, getProjectListService, showProjectListService, updateProjectService, deleteProjectService } from "../Services/projectService";
import mongoose from "mongoose";

const createProject = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
     const errors = validationResult(req)

     if (!errors.isEmpty()) {
          resp.status(422).json({ errors: errors.array() });
          return
     }
     try {

          const userId = req?.user?._id
          if (!userId) {
               throw new Error("User not authenticated");
               return
          }

          const { name, description } = req?.body

          const newProject = await createProjectService({ name, description, owner: userId })


          resp.status(200).json({ status: false, msg: 'project created successfully', data: newProject })



     } catch (error) {
          resp.status(500).json({ status: false, msg: 'Error while creating project', errors: error })

     }
})
const getProjectList = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
     const current_page = Number(req.query.page) || 1
     const per_page = Number(req.query.per_page) || 10


     const skip = (current_page - 1) * per_page
     try {
          const userId = req?.user?._id
          if (!userId) {
               throw new Error("User not authenticated");

          }
          const totalCount = await projectModel.countDocuments({ owner: userId })
          const totalPages = Math.ceil(totalCount / per_page);  // Total pages
          const lastPage = Math.ceil(totalCount / per_page);

          const projects = await getProjectListService({ per_page, skip, id: userId })

          resp.status(200).json({
               status: 200, message: 'project list retrived successfully', data: projects, meta: {
                    totalCount,
                    totalPages, current_page, per_page, lastPage
               }
          })


     } catch (error) {
          resp.status(500).json({ status: false, message: 'Error While Fetching Projects', errors: error })

     }
})

const showProject = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
     try {
          const id = req.params?.id as string
          if (!req.user?._id) {
               resp.status(401).json({ message: "Unauthorized" })
               return
          }
          if (id) {
               const projects = await showProjectListService({ id, owner: req.user._id })
               // const projects = await projectModel.findOne({ _id: id, owner: req.user?._id })
               // const projects = await projectModel.findById(id).where('owner').equals(req.user?._id)

               if (!projects) {

                    resp.status(404).json({
                         status: 404,
                         message: 'Project not found'
                    });
               }


               resp.status(200).json({
                    status: 200, message: 'project list retrived successfully', data: projects
               })


          }

     } catch (error) {
          resp.status(500).json({
               status: 500, message: 'Failed to fetch Projects', errors: error
          })


     }
})

const updateProject = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
     try {
          const projectId = req.params.id as string
          if (!req.user?._id) {
               resp.status(401).json({ message: "Unauthorized" })
               return
          }
          const updatedProject = await updateProjectService({ projectId, owner: req.user?._id, body: req?.body })

          /* const updatedProject = await projectModel.findOneAndUpdate(
               { _id: projectId, owner: req.user?._id },
               { $set: req?.body },
               { new: true, runValidators: true }
          ) */
          if (!updatedProject) {
               resp.status(404).json({ message: "Project not found" });

          }

          resp.status(200).json({ status: 200, message: 'project updated succesfully', data: updatedProject })

     } catch (error) {
          resp.status(500).json({ status: 500, msg: 'Failed to update Project', errors: error })

     }

})
const deleteProject = expressAsyncHandler(async (req: AuthRequest, resp: Response) => {
     try {
          const id = req.params?.id as string
          if (!mongoose.Types.ObjectId.isValid(id)) {
               resp.status(400).json({
                    status: 400,
                    msg: "Invalid project ID"
               });
          }
          if (!req.user?._id) {
               resp.status(401).json({ message: "Unauthorized" })
               return
          }
          const deletedProject = await deleteProjectService({ id, owner: req.user?._id })
          // const deletedProject=await projectModel.findByIdAndDelete(id)
          // const deletedProject = await projectModel.findOneAndDelete({ _id: id, owner: req.user?._id })


          if (!deletedProject) {
               resp.status(404).json({ status: 404, msg: 'project not found', })
          }
          resp.status(200).json({ status: 200, msg: 'project deleted successfully', data: deletedProject })


     } catch (error) {
          resp.status(500).json({ status: 500, msg: 'Failed to delete project', errors: error })
          return;
     }
})
export { createProject, getProjectList, showProject, updateProject, deleteProject }