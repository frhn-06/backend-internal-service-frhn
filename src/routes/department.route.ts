import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js';
import departmentConroller from '../controllers/department.controller.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { UserRole } from '../generated/prisma/enums.js';

const departmentRoute = express.Router();


departmentRoute.post("/", [authMiddleware, roleMiddleware([UserRole.ADMIN])], departmentConroller.create
/**
    #swagger.tags = ["Department"]
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
            $ref: "#/components/schemas/DepartmentRequest"
          }
        }
      }
    }
 */
);

departmentRoute.get("/", [authMiddleware], departmentConroller.findAll
/**
    #swagger.tags = ["Department"]
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
    #swagger.parameters["search"] = {
        in: "query",
        description: "Cari department",
        type: "string"
    }
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

departmentRoute.get("/:id", [authMiddleware], departmentConroller.findById
/**
    #swagger.tags = ["Department"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

departmentRoute.patch("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], departmentConroller.update
/**
    #swagger.tags = ["Department"]
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
            $ref: "#/components/schemas/DepartmentUpdateRequest"
          }
        }
      }
    }
 */
);

departmentRoute.delete("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], departmentConroller.delete
/**
    #swagger.tags = ["Department"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);


export default departmentRoute;

