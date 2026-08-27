import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import departmentConroller from '../controllers/department.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { UserRole } from '../generated/prisma/enums.js';

const departmentRoute = express.Router();


departmentRoute.post("/", [authMiddleware, roleMiddleware([UserRole.ADMIN])], departmentConroller.create);

departmentRoute.get("/", [authMiddleware], departmentConroller.findAll);

departmentRoute.get("/:id", [authMiddleware], departmentConroller.findById);

departmentRoute.patch("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], departmentConroller.update);

departmentRoute.delete("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], departmentConroller.delete);


export default departmentRoute;

