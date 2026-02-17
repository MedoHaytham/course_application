import { asyncWrapper } from "../middleware/asyncWrapper.js";
import User from '../models/user.js'
import AppError from "../utils/appError.js";
import { generateJWT } from "../utils/generateJWT.js";
import { httpStatusText } from "../utils/httpStatusText.js";
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
import fs from 'fs';

dotenv.config();

const getAllUsers = asyncWrapper(
  async (req, res) => {
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page - 1) * limit;
    const users = await User.find({}, {__v: 0, password: 0}).limit(limit).skip(skip);
    res.json({status: httpStatusText.SUCCESS, data: {users}});
  }
);

const register = asyncWrapper(
  async (req, res, next) => {
    const { firstName, lastName, email, password, role } = req.body;

    const oldUser = await User.findOne({email: email});
    if(oldUser) {
      const error = new AppError();
      error.create('email already exists', 400, httpStatusText.FAIL);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return next(error);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      avatar: req.file ? req.file.filename : 'uploads/radahn.png'
    });

    const token = await generateJWT({email: user.email, id: user._id, role: user.role});
    user.token = token;

    await user.save();
    return res.status(201).json({status: httpStatusText.SUCCESS, data: {user}});
  }
);

const login = asyncWrapper(
  async (req, res, next) => {
    const {email, password} = req.body;
    const user = await User.findOne({email: email});

    if(!user) {
      const error = new AppError();
      error.create('user not found', 400, httpStatusText.FAIL);
      return next(error);
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    const token = await generateJWT({email: user.email, id: user._id, role: user.role});

    if(matchedPassword) {
      return res.json({status: httpStatusText.SUCCESS, data: {token}});
    } else {
      const error = new AppError();
      error.create('password is not correct', 400, httpStatusText.FAIL);
      return next(error);
    }
  }
);

const deleteUser = asyncWrapper(
  async (req, res, next) => {
    const userId = req.params.userId;
    const deletedUser = await User.findByIdAndDelete(userId);

    if(!deletedUser) {
      const error = new AppError();
      error.create('user not found', 404, httpStatusText.FAIL);
      return next(error);
    }
    return res.status(200).json({status: httpStatusText.SUCCESS, data: null});
  }
);



export {getAllUsers, register, login, deleteUser};