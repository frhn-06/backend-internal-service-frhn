import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import { UserRole } from '../generated/prisma/browser.js';
import categoryController from '../controllers/category.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const categoryRoute = express.Router();


categoryRoute.post("/", [authMiddleware, roleMiddleware([UserRole.ADMIN])], categoryController.create);

categoryRoute.get("/", [authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.AGENT, UserRole.EMPLOYEE])], categoryController.findAll);

categoryRoute.get("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.AGENT, UserRole.EMPLOYEE])], categoryController.findById);

categoryRoute.patch("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], categoryController.update);

categoryRoute.patch("/:id/status", [authMiddleware, roleMiddleware([UserRole.ADMIN])], categoryController.status);

categoryRoute.delete("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], categoryController.delete);


export default categoryRoute;