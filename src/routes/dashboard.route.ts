import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import { UserRole } from '../generated/prisma/browser.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import dashboardController from '../controllers/dashboard.controller.js';

const dashboardRoute = express.Router();


dashboardRoute.get("/employee", [authMiddleware, roleMiddleware([UserRole.EMPLOYEE])], dashboardController.employee
/**
    #swagger.tags = ["Dashboard"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

dashboardRoute.get("/agent", [authMiddleware, roleMiddleware([UserRole.AGENT])], dashboardController.agent
/**
    #swagger.tags = ["Dashboard"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

dashboardRoute.get("/admin", [authMiddleware, roleMiddleware([UserRole.ADMIN])], dashboardController.admin
/**
    #swagger.tags = ["Dashboard"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);


export default dashboardRoute;
