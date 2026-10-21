import express from 'express'
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const authRoute = express.Router();


authRoute.post("/register", authController.register
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/RegisterRequest"
          }
        }
      }
    }
 */
);

authRoute.post("/login", authController.login
/**
    #swagger.tags = ["Auth"]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/LoginRequest"
          }
        }
      }
    }
 */
);

authRoute.get("/me", [authMiddleware], authController.me
/**
    #swagger.tags = ["Auth"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);


export default authRoute;