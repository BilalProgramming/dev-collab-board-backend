import { body } from "express-validator";

export const createTaskValidator = [
  body("title")
    .exists({ checkFalsy: true }).withMessage("Title is required")
    .isString().withMessage("Title must be a string")
    .isLength({ min: 3, max: 100 }).withMessage("Title must be 3-100 characters")
    .trim(),

  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters")
    .trim(),

  body("status")
    .exists({ checkFalsy: true }).withMessage("Status is required")
    .isString().withMessage("Status must be a string")
    .isIn(["backlog", "todo", "doing", "done"])
    .withMessage("Status must be one of backlog, todo, doing, done"),

  body("projectId")
    .exists({ checkFalsy: true }).withMessage("Project ID is required")
    .isMongoId().withMessage("Project ID must be a valid MongoDB ObjectId"),
];
