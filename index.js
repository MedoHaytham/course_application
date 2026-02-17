import express, { json } from "express";
// import { body, validationResult } from "express-validator";
import mongoose from "mongoose";
import coursesRouter from "./routes/coureses_routes.js";
import usersRouter from "./routes/users_routes.js";
import { httpStatusText } from "./utils/httpStatusText.js";
import dotenv from "dotenv";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const url = process.env.MONGO_URL;
mongoose.connect(url).then(()=>{
  console.log('connected to mongodb');
}).catch((err)=>{
  console.log(err);
});

app.use(cors());
app.use(express.json());
app.use('/api/courses', coursesRouter);
app.use('/api/users', usersRouter);

// global middleware for not found routes
app.all(/(.*)/,(req, res, next) => {
  res.status(404).json({status: httpStatusText.ERROR, message: 'this resource is not available'});  
});

// global middleware for error handling
app.use((err, req, res, next) => {
  res.status(err.code || 500).json({status: err.statusText || httpStatusText.ERROR, message: err.message, data: err.data});
});

// app.post('/api/courses', [
//   body('title')
//     .notEmpty()
//     .withMessage('title is required')
//     .isLength({min: 2})
//     .withMessage('title at least is 2 chars'),
//   body('price')
//     .notEmpty()
//     .withMessage('price is required')
// ], (req, res) => {

//   const errors = validationResult(req)
  
//   if(!errors.isEmpty()) {
//     return res.status(400).json(errors.array());
//   }

//   const course = {id: courses.length + 1, ...req.body};
//   courses.push(course);
//   console.log(course);
//   res.status(201).json(course);
// });

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is running on port 3000");
});