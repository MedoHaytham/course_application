import { validateCourse } from "../validators/course_validator.js";
// import courses from "../data/courses.js";
import Course from "../models/course.js";
import {httpStatusText} from "../utils/httpStatusText.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import AppError from "../utils/appError.js";

const getAllCourses = asyncWrapper(
  async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1 ) * limit;
    const courses = await Course.find({}, {__v: 0}).limit(limit).skip(skip);
    return res.json({status: httpStatusText.SUCCESS, data: {courses}});
  }
);

const getCourseById = asyncWrapper(
  async (req, res, next) => {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId, {__v: 0});
    if (!course) {
      const error = new AppError();
      error.create('course not found', 404, httpStatusText.FAIL);
      return next(error);
    }
    return res.json({status: httpStatusText.SUCCESS, data: {course}});
  }
);

const addCourse = asyncWrapper(
  async (req, res, next) => {
    const result = validateCourse(req.body);

    if(!result.success) {
      const error = new AppError();
      error.create('invalid data', 400, httpStatusText.FAIL, {...result.error.issues});
      return next(error);
    }

    const newCourse = new Course(req.body);
    await newCourse.save();
    return res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});
  }
);

const upadateCourse = asyncWrapper(
  async (req, res, next)=> {
    const courseId = req.params.courseId;
    const updatedCourse = await Course.findByIdAndUpdate(courseId, {$set: {...req.body}}, {returnDocument: 'after'});
    
    if(!updatedCourse) {
      const error = new AppError();
      error.create('course not found', 404, httpStatusText.FAIL);
      return next(error);
    }
    return res.status(200).json({status: httpStatusText.SUCCESS, data: {course: updatedCourse}});
  }
)

const deleteCourse = asyncWrapper(
  async (req, res, next) => {
    const courseId = req.params.courseId;
    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if(!deletedCourse) {
      const error = new AppError();
      error.create('course not found', 404, httpStatusText.FAIL);
      return next(error);
    }
    return res.status(200).json({status: httpStatusText.SUCCESS, data: null});
  }
);

export {getAllCourses, getCourseById, addCourse, upadateCourse, deleteCourse};
