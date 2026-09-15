import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import notificationController from '../controllers/notification.controller.js';

const notificationRoute = express.Router();


notificationRoute.get("/", [authMiddleware], notificationController.findAll);


notificationRoute.get("/count-all", [authMiddleware], notificationController.countAll);

notificationRoute.get("/count-all-message", [authMiddleware], notificationController.countMessage);

notificationRoute.get("/count-message-by-ticket", [authMiddleware], notificationController.countMessageByTicket);

notificationRoute.patch("/:id", [authMiddleware], notificationController.readNotificationById);

notificationRoute.patch("/:ticketId/message", [authMiddleware], notificationController.readNotificationMessage)



export default notificationRoute;