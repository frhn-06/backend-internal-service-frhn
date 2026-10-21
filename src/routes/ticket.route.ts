import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import ticketController from '../controllers/ticket.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { StatusTicket, UserRole } from '../generated/prisma/enums.js';
import statusTicketMiddleware from '../middlewares/status.ticket.middleware.js';
import messageController from '../controllers/message.controller.js';
import aiController from '../controllers/ai.controller.js';

const ticketRoute = express.Router();


ticketRoute.post("/", [authMiddleware, roleMiddleware([UserRole.EMPLOYEE])], ticketController.create
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/TicketRequest"
          }
        }
      }
    }
 */
);

ticketRoute.get("/", [authMiddleware], ticketController.findByRole
/**
    #swagger.tags = ["Ticket"]
    #swagger.parameters["page"] = {
        in: "query",
        description: "Nomor halaman",
        type: "integer",
        default: 1
    }
    #swagger.parameters["limit"] = {
        in: "query",
        description: "Jumlah data per halaman",
        type: "integer",
        default: 32
    }
    #swagger.parameters["status"] = {
        in: "query",
        description: "Filter berdasarkan status",
        type: "string"
    }
    #swagger.parameters["priority"] = {
        in: "query",
        description: "Filter berdasarkan tingkat prioritas",
        type: "string"
    }
    #swagger.parameters["search"] = {
        in: "query",
        description: "Cari tiket",
        type: "string"
    }
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.get("/find/department", [authMiddleware], ticketController.findByDepartment
/**
    #swagger.tags = ["Ticket"]
    #swagger.parameters["page"] = {
        in: "query",
        description: "Nomor halaman",
        type: "integer",
        default: 1
    }
    #swagger.parameters["limit"] = {
        in: "query",
        description: "Jumlah data per halaman",
        type: "integer",
        default: 32
    }
    #swagger.parameters["status"] = {
        in: "query",
        description: "Filter berdasarkan status",
        type: "string"
    }
    #swagger.parameters["priority"] = {
        in: "query",
        description: "Filter berdasarkan tingkat prioritas",
        type: "string"
    }
    #swagger.parameters["search"] = {
        in: "query",
        description: "Cari tiket",
        type: "string"
    }
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.get("/:id", [authMiddleware], ticketController.findById
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.patch("/:id/take", [
    authMiddleware, 
    roleMiddleware([UserRole.AGENT]), 
    statusTicketMiddleware([StatusTicket.OPEN])
], ticketController.take
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.patch("/:id/wait", [
    authMiddleware, 
    roleMiddleware([UserRole.AGENT]), 
    statusTicketMiddleware([StatusTicket.IN_PROGRESS, StatusTicket.RE_PROGRESS])
], ticketController.waiting
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.patch("/:id/resolve", [
    authMiddleware, 
    roleMiddleware([UserRole.AGENT]), 
    statusTicketMiddleware([StatusTicket.IN_PROGRESS, StatusTicket.RE_PROGRESS, StatusTicket.WAITING])
], ticketController.resolved
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.patch("/:id/next_progress", [
    authMiddleware, 
    roleMiddleware([UserRole.AGENT]), 
    statusTicketMiddleware([StatusTicket.WAITING])
], ticketController.nextProgress
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.patch("/:id/re_progress", [
    authMiddleware, 
    roleMiddleware([UserRole.EMPLOYEE]), 
    statusTicketMiddleware([StatusTicket.RESOLVED])
], ticketController.reProgress
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.patch("/:id/close", [
    authMiddleware, 
    roleMiddleware([UserRole.EMPLOYEE]), 
    statusTicketMiddleware([StatusTicket.RESOLVED])
], ticketController.closed
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

ticketRoute.patch("/:id/cancel", [
    authMiddleware, 
    roleMiddleware([UserRole.EMPLOYEE]), 
    statusTicketMiddleware([StatusTicket.OPEN, StatusTicket.IN_PROGRESS, StatusTicket.RE_PROGRESS, StatusTicket.WAITING])
], ticketController.cancelled
/**
    #swagger.tags = ["Ticket"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);







ticketRoute.post("/:id/message", [authMiddleware, statusTicketMiddleware([
    StatusTicket.OPEN,
    StatusTicket.IN_PROGRESS, 
    StatusTicket.WAITING, 
    StatusTicket.RE_PROGRESS,])],
messageController.create
/**
    #swagger.tags = ["Ticket - Message"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/MessageRequest"
          }
        }
      }
    }
 */
);


ticketRoute.get("/:id/message", [authMiddleware], messageController.findManyWithPagination
/**
    #swagger.tags = ["Ticket - Message"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);






ticketRoute.post("/:id/ai/reply", [authMiddleware, roleMiddleware([UserRole.AGENT]), statusTicketMiddleware([
    StatusTicket.OPEN,
    StatusTicket.IN_PROGRESS,
    StatusTicket.WAITING,
    StatusTicket.RE_PROGRESS
])], aiController.generate
/**
    #swagger.tags = ["Ticket - Ai Interegation"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
)



export default ticketRoute;