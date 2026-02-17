import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateJWT = async(payload) => {
  const token = await jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: '1m'});
  return token;
}
