import { Response } from "express";
import { IreqUser } from "../types/user.js";
import response from "../utils/response.js";
import { DepartmentDTO } from "../validations/department.validation.js";
import prisma from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import DepartmentService from "../services/department.service.js";

const departmentConroller = {
    create: async (req: IreqUser, res: Response) => {
        try {
            const validate = DepartmentDTO.parse(req.body);

            const result = await DepartmentService.create(validate);

            response.success(res, result, "Success to create department")
        }catch(error) {
            response.error(res, error, "Failed to create department")
        }
    },


    findAll: async (req:IreqUser, res: Response) => {
        try {
            const {
                page = 1,
                limit = 8,
                search
            } = req.query as {
                page: number | string;
                limit: number | string;
                search: string;
            }
            
            const pageNumber = Number(page);
            const limitNumber = Number(limit);
            if(Number.isNaN(pageNumber) || Number.isNaN(limitNumber)) return response.notFound(res, "List department tidak ditemukan")

            const setQuery = () : Prisma.DepartmentWhereInput => {
                let query : Prisma.DepartmentWhereInput  = {};
                if(search) {
                    query.name = {
                        contains: search,
                        mode: "insensitive"
                    }
                } 
                return query
            }

            const query = setQuery();

            const result = await DepartmentService.findMany(query, pageNumber, limitNumber);

            const totalData = await DepartmentService.countTotal(query);

            response.pagination(
                res, result, {
                    currentPage: pageNumber,
                    totalPage: Math.ceil(totalData / limitNumber),
                    total: totalData
                },"Success to find departments"
            );

        } catch(error) {
            response.error(res, error, "Failed to find departments")
        }
    },


    findById: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Department tidak ditemukan");
            const idNumber = Number(id)
            if(Number.isNaN(idNumber)) return response.notFound(res, "Agent tidak ditemukan");

            const result = await DepartmentService.findById(idNumber);

            if(!result) return response.notFound(res, "Department tidak ditemukan");

            response.success(res, result, "Success to find department")
        } catch (error) {
            response.error(res, error, "Failed to find department")
        }
    },


    update: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Department tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Agent tidak ditemukan");

            const validate = DepartmentDTO.partial();
            const validateUpdate = validate.parse(req.body);

            const result = await DepartmentService.update(idNumber, validateUpdate);

            response.success(res, result, "Success to update department")
        } catch (error) {
            response.error(res, error, "Failed to update department")
        }
    },


    delete: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Department tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Agent tidak ditemukan");

            const result = await DepartmentService.delete(idNumber);

            response.success(res, result, "Success to delete department")
        } catch (error) {
            response.error(res, error, "Failed to delete department")
        }
    },


}


export default departmentConroller;