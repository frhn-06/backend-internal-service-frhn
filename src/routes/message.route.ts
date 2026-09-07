import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import statusTicketMiddleware from '../middlewares/status.ticket.middleware.js';
import { StatusTicket } from '../generated/prisma/enums.js';
import messageController from '../controllers/message.controller.js';


const messageRoute = express.Router();

messageRoute.post("/:id", [authMiddleware, statusTicketMiddleware([
    StatusTicket.OPEN,
    StatusTicket.IN_PROGRESS, 
    StatusTicket.WAITING, 
    StatusTicket.RE_PROGRESS,])],
messageController.create);


messageRoute.get("/:id", [authMiddleware], messageController.findMany);

export default messageRoute;