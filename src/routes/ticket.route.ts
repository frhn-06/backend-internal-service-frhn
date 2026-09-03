import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import ticketController from '../controllers/ticket.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { UserRole } from '../generated/prisma/enums.js';

const ticketRoute = express.Router();


ticketRoute.post("/", [authMiddleware, roleMiddleware([UserRole.EMPLOYEE])], ticketController.create);

ticketRoute.get("/", [authMiddleware, roleMiddleware([UserRole.EMPLOYEE, UserRole.AGENT, UserRole.ADMIN])], ticketController.findByRole);


export default ticketRoute;