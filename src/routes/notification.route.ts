import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import notificationController from '../controllers/notification.controller.js';

const notificationRoute = express.Router();


notificationRoute.get("/", [authMiddleware], notificationController.findAll
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

notificationRoute.get("/count-all", [authMiddleware], notificationController.countAll
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

notificationRoute.get("/count-all-message", [authMiddleware], notificationController.countMessage
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

notificationRoute.get("/count-message-by-ticket", [authMiddleware], notificationController.countMessageByTicket
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

notificationRoute.patch("/:id/read", [authMiddleware], notificationController.readNotificationById
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

notificationRoute.patch("/:ticketId/read-message", [authMiddleware], notificationController.readNotificationMessage
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

notificationRoute.patch("/mark-all/mark-all", [authMiddleware], notificationController.markAll
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

notificationRoute.delete("/:id/delete", [authMiddleware], notificationController.removeById
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

notificationRoute.delete("/delete-all", [authMiddleware], notificationController.removeMany
/**
    #swagger.tags = ["Notification"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);



export default notificationRoute;