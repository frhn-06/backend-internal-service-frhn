import express from 'express'
import employeeController from '../controllers/employee.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { UserRole } from '../generated/prisma/browser.js';

const employeeRoute = express.Router();


employeeRoute.get("/", [authMiddleware, roleMiddleware([UserRole.ADMIN])], employeeController.findAll);

employeeRoute.get("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], employeeController.findOne);

employeeRoute.patch("/:id/status", [authMiddleware, roleMiddleware([UserRole.ADMIN])], employeeController.status);

employeeRoute.delete("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], employeeController.delete);



export default employeeRoute;