import { Response } from "express";
import { IreqUser } from "../types/user.js";
import response from "../utils/response.js";
import { Prisma, UserRole } from "../generated/prisma/client.js";
import UserService from "../services/user.service.js";

const employeeController = {
    findAll: async(req:IreqUser, res:Response) => {
        try {
            const {
                page = 1,
                limit = 8,
                active,
                search
            } = req.query as {
                page: number | string; 
                limit: number | string; 
                active: boolean | string; 
                search: string
            }

            const numberPage = Number(page);
            const numberLimit = Number(limit);
            if(Number.isNaN(numberLimit) || Number.isNaN(numberPage)) return response.notFound(res, "List employee tidak ditemukan");

            const setQuery = () => {
                let query:Prisma.UserWhereInput = {
                    role: UserRole.EMPLOYEE
                }

                if(search) {
                    query.name = {
                        contains: search,
                        mode: "insensitive"
                    }
                }

                if(active === "true") {
                    query.isActive = true;
                } 
                
                if(active === "false") {
                    query.isActive = false;
                }

                return query;
            }

            const query = setQuery();

            const result = await UserService.findAll(query, numberPage, numberLimit);

            const totalData = await UserService.countTotal(query);

            return response.pagination(res, result, {
                total: totalData,
                currentPage: numberPage,
                totalPage: Math.ceil(totalData / numberLimit)
            }, "Success to find all employee")

        } catch(error) {
            response.error(res, error, "Failed to find all employee")
        }
    },



    findOne: async(req:IreqUser, res:Response) => {
        try {
            const { id } = req.params;
            if(!id) return response.notFound(res, "Employee tidak ditemukan");
            const numberId = Number(id);
            if(Number.isNaN(numberId)) return response.notFound(res, "Employee tidak ditemukan");

            const query:Prisma.UserWhereInput = {
                role: UserRole.EMPLOYEE
            }

            const result = await UserService.getUserById(numberId, query);
            if(!result) return response.notFound(res, "Employee tidak ditemukan");

            return response.success(res, result, "Success to find employee");
        } catch(error) {
            response.error(res, error, "Failed to find employee")
        }
    },



    status: async(req:IreqUser, res:Response) => {
        try {
            const { id } = req.params;
            if(!id) return response.notFound(res, "Employee tidak ditemukan");
            const numberId = Number(id);
            if(Number.isNaN(numberId)) return response.notFound(res, "Employee tidak ditemukan");

            const employee = await UserService.getUserById(numberId, {
                role: UserRole.EMPLOYEE
            });
            if(!employee) return response.notFound(res, "Employee tidak ditemukan");

            const result = await UserService.updateStatus(numberId, !employee.isActive);

            return response.success(res, result, "Success to update status employee");
        } catch(error) {
            response.error(res, error, "Failed to update status employee")
        }
    },


    delete: async(req:IreqUser, res:Response) => {
        try {
            const { id } = req.params;
            if(!id) return response.notFound(res, "Employee tidak ditemukan");
            const numberId = Number(id);
            if(Number.isNaN(numberId)) return response.notFound(res, "Employee tidak ditemukan");

            const result = await UserService.delete(numberId);

            return response.success(res, result, "Success to delete employee");
        } catch(error) {
            response.error(res, error, "Failed to delete employee")
        }
    }
}

export default employeeController;