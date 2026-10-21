import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import { UserRole } from '../generated/prisma/browser.js';
import categoryController from '../controllers/category.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const categoryRoute = express.Router();


categoryRoute.post("/", [authMiddleware, roleMiddleware([UserRole.ADMIN])], categoryController.create
/**
    #swagger.tags = ["Category of Department"]
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
            $ref: "#/components/schemas/CategoryDepartmentRequest"
          }
        }
      }
    }
 */
);

categoryRoute.get("/", [authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.AGENT, UserRole.EMPLOYEE])], categoryController.findAll
/**
    #swagger.tags = ["Category of Department"]
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
    #swagger.parameters["search"] = {
        in: "query",
        description: "Cari kategori",
        type: "string"
    }
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

categoryRoute.get("/:id/by-department", [authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.AGENT, UserRole.EMPLOYEE])], categoryController.findByDepartment
/**
    #swagger.tags = ["Category of Department"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

categoryRoute.get("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN, UserRole.AGENT, UserRole.EMPLOYEE])], categoryController.findById
/**
    #swagger.tags = ["Category of Department"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

categoryRoute.patch("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], categoryController.update
/**
    #swagger.tags = ["Category of Department"]
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
            $ref: "#/components/schemas/CategoryDepartmentUpdateRequest"
          }
        }
      }
    }
 */
);

categoryRoute.patch("/:id/status", [authMiddleware, roleMiddleware([UserRole.ADMIN])], categoryController.status
/**
    #swagger.tags = ["Category of Department"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

categoryRoute.delete("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], categoryController.delete
/**
    #swagger.tags = ["Category of Department"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);


export default categoryRoute;