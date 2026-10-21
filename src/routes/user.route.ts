import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';
const userRoute = express.Router();

userRoute.patch("/update-profile", [authMiddleware], userController.update
/**
    #swagger.tags = ["User"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserUpdateProfileRequest"
          }
        }
      }
    }
 */
);

userRoute.patch("/update-password", [authMiddleware], userController.updatePassword
/**
    #swagger.tags = ["User"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserUpdatePasswordRequest"
          }
        }
      }
    }
 */
);



export default userRoute;
