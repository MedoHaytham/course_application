import express from "express";
import { getAllCourses, getCourseById, addCourse, upadateCourse, deleteCourse } from "../controllers/coureses_controller.js";
import verifyToken from "../middleware/verifyToken.js";
import usersRoles from "../utils/usersRoles.js";
import allowedTo from "../middleware/allowedTo.js";

const router = express.Router();

router.route('/')
  .get(getAllCourses)
  .post(verifyToken, allowedTo(usersRoles.ADMIN, usersRoles.MANAGER),addCourse);

router.route('/:courseId')
  .get(getCourseById)
  .patch(verifyToken, allowedTo(usersRoles.ADMIN, usersRoles.MANAGER) ,upadateCourse)
  .delete(verifyToken, allowedTo(usersRoles.ADMIN, usersRoles.MANAGER), deleteCourse);

export default router;
