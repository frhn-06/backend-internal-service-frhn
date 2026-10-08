import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import { UserRole } from '../generated/prisma/browser.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import dashboardController from '../controllers/dashboard.controller.js';

const dashboardRoute = express.Router();


dashboardRoute.get("/employee", [authMiddleware, roleMiddleware([UserRole.EMPLOYEE])], dashboardController.employee);

dashboardRoute.get("/agent", [authMiddleware, roleMiddleware([UserRole.AGENT])], dashboardController.agent);

dashboardRoute.get("/admin", [authMiddleware, roleMiddleware([UserRole.ADMIN])], dashboardController.admin);


export default dashboardRoute;
