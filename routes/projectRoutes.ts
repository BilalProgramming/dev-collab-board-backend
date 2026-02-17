import { createProject,getProjectList,showProject } from "../controllers/ProjectController";
import express from 'express'
import { body } from "express-validator";
import { authMiddleware } from "../middleware/authMiddleware";
const router = express.Router()

router.post('/projects', [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required")
        .isString()
        .withMessage("Description must be a string"),

], authMiddleware, createProject)
router.get('/projects',authMiddleware,getProjectList)
router.get('/projects/:id',authMiddleware,showProject)


export default router