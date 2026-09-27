import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import notificationController from '../controllers/notification.controller.js';

const notificationRoute = express.Router();


notificationRoute.get("/", [authMiddleware], notificationController.findAll);


notificationRoute.get("/count-all", [authMiddleware], notificationController.countAll);

notificationRoute.get("/count-all-message", [authMiddleware], notificationController.countMessage);

notificationRoute.get("/count-message-by-ticket", [authMiddleware], notificationController.countMessageByTicket);

notificationRoute.patch("/:id/read", [authMiddleware], notificationController.readNotificationById);

notificationRoute.patch("/:ticketId/read-message", [authMiddleware], notificationController.readNotificationMessage);

notificationRoute.patch("/mark-all/mark-all", [authMiddleware], notificationController.markAll);

notificationRoute.delete("/:id/delete", [authMiddleware], notificationController.removeById);

notificationRoute.delete("/delete-all", [authMiddleware], notificationController.removeMany);



export default notificationRoute;