import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { UserRole } from '../generated/prisma/enums.js';
import agentController from '../controllers/agent.controller.js';

const agentRoute = express.Router();

agentRoute.post("/", [authMiddleware, roleMiddleware([UserRole.ADMIN])], agentController.create);

agentRoute.get("/", [authMiddleware], agentController.findAll);

agentRoute.get("/:id", [authMiddleware], agentController.findById);

agentRoute.patch("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], agentController.update);

agentRoute.delete("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], agentController.delete);

agentRoute.patch("/:id/status", [authMiddleware, roleMiddleware([UserRole.ADMIN])], agentController.updateStatus);


export default agentRoute;

