import AppError from "../utils/appError.js";
import { httpStatusText } from "../utils/httpStatusText.js";

const allowedTo = (...roles) => {
  return (req, res, next)=> {
    if (!roles.includes(req.currentUser.role)){
      const error = new AppError;
      error.create('this role is not authorized', 401, httpStatusText.FAIL);
      return next(error);
    }
    next();
  }
}

export default allowedTo;