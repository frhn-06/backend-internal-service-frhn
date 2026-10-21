import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { UserRole } from '../generated/prisma/enums.js';
import agentController from '../controllers/agent.controller.js';

const agentRoute = express.Router();

agentRoute.post("/", [authMiddleware, roleMiddleware([UserRole.ADMIN])], agentController.create
/**
    #swagger.tags = ["Agent"]
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
            $ref: "#/components/schemas/AgentRequest"
          }
        }
      }
    }
 */
);

agentRoute.get("/", [authMiddleware], agentController.findAll
/**
    #swagger.tags = ["Agent"]
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
        default: 8
    }
    #swagger.parameters["active"] = {
        in: "query",
        description: "Filter berdasarkan status aktif",
        type: "string"
    }
    #swagger.parameters["depart"] = {
        in: "query",
        description: "Filter berdasarkan ID department",
        type: "string"
    }
    #swagger.parameters["search"] = {
        in: "query",
        description: "Cari agent",
        type: "string"
    }
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

agentRoute.get("/:id", [authMiddleware], agentController.findById
/**
    #swagger.tags = ["Agent"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

agentRoute.patch("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], agentController.update
/**
    #swagger.tags = ["Agent"]
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
            $ref: "#/components/schemas/AgentUpdateRequest"
          }
        }
      }
    }
 */
);

agentRoute.delete("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], agentController.delete
/**
    #swagger.tags = ["Agent"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

agentRoute.patch("/:id/status", [authMiddleware, roleMiddleware([UserRole.ADMIN])], agentController.updateStatus
/**
    #swagger.tags = ["Agent"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);


export default agentRoute;

