import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import dotenv from "dotenv";
dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'] || req.headers['authorization'];

  if(!authHeader) {
    const error = new AppError();
    error.create('token is required', 401, httpStatusText.FAIL);
    return next(error);
  }

  const token = authHeader.split(' ')[1];

  try {
    const currentUser = jwt.verify(token, process.env.SECRET_KEY);
    req.currentUser = currentUser;
    next();
  } catch (err) {
    const error = new AppError();
    error.create(err.message, 401, httpStatusText.FAIL);
    return next(error);
  }
};

export default verifyToken;