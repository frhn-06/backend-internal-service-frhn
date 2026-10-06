import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';
const userRoute = express.Router();

userRoute.patch("/update-profile", [authMiddleware], userController.update);

userRoute.patch("/update-password", [authMiddleware], userController.updatePassword);



export default userRoute;
