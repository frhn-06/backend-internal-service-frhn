import express from 'express'
import employeeController from '../controllers/employee.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';
import { UserRole } from '../generated/prisma/browser.js';

const employeeRoute = express.Router();


employeeRoute.get("/", [authMiddleware, roleMiddleware([UserRole.ADMIN])], employeeController.findAll
/**
    #swagger.tags = ["Employee"]
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
        description: "Cari employee",
        type: "string"
    }
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

employeeRoute.get("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], employeeController.findOne
/**
    #swagger.tags = ["Employee"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

employeeRoute.patch("/:id/status", [authMiddleware, roleMiddleware([UserRole.ADMIN])], employeeController.status
/**
    #swagger.tags = ["Employee"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);

employeeRoute.delete("/:id", [authMiddleware, roleMiddleware([UserRole.ADMIN])], employeeController.delete
/**
    #swagger.tags = ["Employee"]
    #swagger.security = [
      {
        "bearerAuth": []
      }
    ]
 */
);



export default employeeRoute;