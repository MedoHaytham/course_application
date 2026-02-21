import express from 'express';
import { getAllUsers, login, register, deleteUser, getUserById, getUsers, getAdmins, getManagers } from '../controllers/users_controller.js';
import verifyToken from '../middleware/verifyToken.js';
import multer from 'multer';
import AppError from '../utils/appError.js';
import { httpStatusText } from '../utils/httpStatusText.js';
import allowedTo from '../middleware/allowedTo.js';
import usersRoles from '../utils/usersRoles.js';

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function(req, file, cb){
    const ext = file.mimetype.split('/')[1];
    const filename = `user-${Date.now()}.${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const imageFile = file.mimetype.split('/')[0];
  if(imageFile === 'image') {
    return cb(null, true);
  }else {
    const error = new AppError();
    error.create('file must be an image', 400, httpStatusText.FAIL);
    return cb(error, false);
  }
}

const upload = multer({storage, fileFilter});

const router = express.Router();

router.route('/')
  .get(verifyToken, allowedTo(usersRoles.MANAGER), getAllUsers);

router.route('/register')
  .post(upload.single('avatar'), register);

router.route('/login')
  .post(login);

router.route('/users')
  .get(verifyToken, allowedTo(usersRoles.ADMIN, usersRoles.MANAGER), getUsers);

router.route('/admins')
  .get(verifyToken, allowedTo(usersRoles.MANAGER), getAdmins);

router.route('/managers')
  .get(verifyToken, allowedTo(usersRoles.MANAGER), getManagers);

router.route('/:userId')
  .get(verifyToken, allowedTo(usersRoles.MANAGER), getUserById)
  .delete(verifyToken, allowedTo(usersRoles.MANAGER), deleteUser);

export default router;