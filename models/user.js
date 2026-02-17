import mongoose from "mongoose";
import validator from "validator";
import usersRoles from "../utils/usersRoles.js";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String, 
    required: true, 
    unique: true, 
    validate: [validator.isEmail,'field must be a valid email address']
  },
  password: { type: String, required: true },
  token: { type: String },
  role: {
    type: String,
    enum: [usersRoles.ADMIN, usersRoles.USER, usersRoles.MANAGER],
    default: usersRoles.USER
  },
  avatar: { type: String, default: 'uploads/radahn.png' }
});

export default mongoose.model('user', userSchema);