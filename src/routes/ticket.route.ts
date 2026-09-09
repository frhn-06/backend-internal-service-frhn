import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import ticketController from '../controllers/ticket.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { StatusTicket, UserRole } from '../generated/prisma/enums.js';
import statusTicketMiddleware from '../middlewares/status.ticket.middleware.js';
import messageController from '../controllers/message.controller.js';

const ticketRoute = express.Router();


ticketRoute.post("/", [authMiddleware, roleMiddleware([UserRole.EMPLOYEE])], ticketController.create);

ticketRoute.get("/", [authMiddleware], ticketController.findByRole);

ticketRoute.get("/find/department", [authMiddleware], ticketController.findByDepartment);

ticketRoute.get("/:id", [authMiddleware], ticketController.findById);

ticketRoute.patch("/:id/take", [
    authMiddleware, 
    roleMiddleware([UserRole.AGENT]), 
    statusTicketMiddleware([StatusTicket.OPEN])
], ticketController.take);

ticketRoute.patch("/:id/wait", [
    authMiddleware, 
    roleMiddleware([UserRole.AGENT]), 
    statusTicketMiddleware([StatusTicket.IN_PROGRESS, StatusTicket.RE_PROGRESS])
], ticketController.waiting);

ticketRoute.patch("/:id/resolve", [
    authMiddleware, 
    roleMiddleware([UserRole.AGENT]), 
    statusTicketMiddleware([StatusTicket.IN_PROGRESS, StatusTicket.RE_PROGRESS, StatusTicket.WAITING])
], ticketController.resolved);

ticketRoute.patch("/:id/next_progress", [
    authMiddleware, 
    roleMiddleware([UserRole.AGENT]), 
    statusTicketMiddleware([StatusTicket.WAITING])
], ticketController.nextProgress);

ticketRoute.patch("/:id/re_progress", [
    authMiddleware, 
    roleMiddleware([UserRole.EMPLOYEE]), 
    statusTicketMiddleware([StatusTicket.RESOLVED])
], ticketController.reProgress);

ticketRoute.patch("/:id/close", [
    authMiddleware, 
    roleMiddleware([UserRole.EMPLOYEE]), 
    statusTicketMiddleware([StatusTicket.RESOLVED])
], ticketController.closed);

ticketRoute.patch("/:id/cancel", [
    authMiddleware, 
    roleMiddleware([UserRole.EMPLOYEE]), 
    statusTicketMiddleware([StatusTicket.OPEN, StatusTicket.IN_PROGRESS, StatusTicket.RE_PROGRESS, StatusTicket.WAITING])
], ticketController.cancelled);



ticketRoute.post("/:id/message", [authMiddleware, statusTicketMiddleware([
    StatusTicket.OPEN,
    StatusTicket.IN_PROGRESS, 
    StatusTicket.WAITING, 
    StatusTicket.RE_PROGRESS,])],
messageController.create);


ticketRoute.get("/:id/message", [authMiddleware], messageController.findMany);



export default ticketRoute;