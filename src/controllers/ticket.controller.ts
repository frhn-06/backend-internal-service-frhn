import { Response } from "express";
import { IreqUser } from "../types/user.js";
import response from "../utils/response.js";
import { TicketDTO } from "../validations/ticket.validation.js";
import DepartmentService from "../services/department.service.js";
import CategoryService from "../services/category.service.js";
import TicketService from "../services/ticket.service.js";
import { PriorityTicket, Prisma, StatusTicket, UserRole } from "../generated/prisma/client.js";
import UserService from "../services/user.service.js";
import AgentService from "../services/agent.service.js";

const ticketController = {
    create: async(req:IreqUser, res:Response) => {
        try {
            const id = req.user?.id;
            if(!id) return response.notFound(res, "Employee tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Employee tidak ditemukan");

            const validate = TicketDTO.parse(req.body);

            const department = await DepartmentService.findById(validate.departmentId);
            if(!department) return response.notFound(res, "Department tidak ditemukan");

            const query = {
                id: validate.categoryId,
                departmentId: department.id,
                isActive: true
            }

            const category = await CategoryService.findByQuery(query);
            if(!category) return response.notFound(res, "Category tidak ditemukan");

           
            const result = await TicketService.create(idNumber, validate);

            response.success(res, result, "Success to create ticket")
            
        } catch(error) {
            response.error(res, error, "Failed to create ticket");
        }
    },


    findByRole: async(req:IreqUser, res:Response) => {
        try {
            const id = req.user?.id;
            if(!id) return response.notFound(res, "User tidak ditemukan");            

            const role = req.user?.role;
            if(!role) return response.notFound(res, "User tidak ditemukan");

            const {
                page = 1,
                limit = 32,
                status,
                priority,
                search
            } = req.query;

            const numberPage = Number(page);
            const numberLimit = Number(limit);
            if(Number.isNaN(numberPage) || Number.isNaN(numberLimit)) return response.notFound(res, "Tickets tidak ditemukan")
            

            const user = await UserService.getUserById(id);
            if(!user) return response.notFound(res, "User tidak ditemukan");
           
            const setQuery = () => {
                let query : Prisma.TicketWhereInput = {};


                if(role === UserRole.AGENT) {
                    if(user.departmentId) {
                        query.departmentId = user.departmentId;
                    }
                }

                if(role === UserRole.EMPLOYEE) query.employeeId = id

                if(status) query.status = status as StatusTicket

                if(priority) query.priority = priority as PriorityTicket

                if(search && typeof search === "string") {
                    query.OR = [
                        {
                            title: {
                                contains: search,
                                mode: "insensitive"
                            } 
                        },
                        {
                            number: {
                                contains: search,
                                mode: "insensitive"
                            }
                        }
                    ]
                }

                return query;
            }   

            const query = setQuery()

            const result = await TicketService.findByRole(query, numberPage, numberLimit);

            const total = await TicketService.counttotal(query);

            return response.pagination(res, result, {
                total,
                totalPage: Math.ceil(total / numberLimit),
                currentPage: numberPage
            }, "Success to find tickets")


        } catch(error) {
            response.error(res, error, "Failed to find tickets");
        }
    }
}


export default ticketController;