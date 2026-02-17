import { httpStatusText } from "../utils/httpStatusText.js";

export const asyncWrapper = (asyncFN) => {
  return(req, res, next) => {
    asyncFN(req, res, next).catch((err) => {
      err.statusText = httpStatusText.ERROR;
      err.code = 500;
      next(err);
    });
  };
};