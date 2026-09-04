import { Response } from "express";
import { IreqUser, IReqUserPlusTicket } from "../types/user.js";
import response from "../utils/response.js";
import { TicketDTO } from "../validations/ticket.validation.js";
import DepartmentService from "../services/department.service.js";
import CategoryService from "../services/category.service.js";
import TicketService from "../services/ticket.service.js";
import { PriorityTicket, Prisma, StatusTicket, UserRole } from "../generated/prisma/client.js";
import UserService from "../services/user.service.js";




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
                    if(!user.departmentId) {
                        throw Error("Agent tidak memiliki department");
                    }

                    query.agentId = user.id;
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
    },


    findByDepartment: async(req:IreqUser, res:Response) => {
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
            if(!user.departmentId) return response.error(res, false, "Agent belum memiliki department");
           
            const setQuery = () => {
                let query : Prisma.TicketWhereInput = {
                    departmentId: user.departmentId as unknown as Prisma.IntFilter<"Ticket">
                };

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
    },


    findById: async(req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if(!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");
            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const role = req.user?.role;

            const user = await UserService.getUserById(userIdNumber);
            if(!user) return response.notFound(res, "User tidak ditemukan")

            const setQuery = () => {
                let query : Prisma.TicketWhereInput = {}

                if(role === UserRole.EMPLOYEE) query.employeeId = userIdNumber;

                if(role === UserRole.AGENT) {
                    if(!user.departmentId) throw Error("Agent tidak memiliki department");
                    query.departmentId = user.departmentId
                }

                return query;
            }

            const query = setQuery()
            
            const result = await TicketService.findById(idNumber, query);
            if(!result) return response.notFound(res, "Ticket tidak ditemukan");

            response.success(res, result, "Success to find a ticket")
        } catch(error) {
            response.error(res, error, "Failed to find a ticket");    
        }
    },



    take: async(req: IReqUserPlusTicket, res:Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if(!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if(!user || !user.departmentId) return response.forbidden(res);

            if(user.departmentId !== ticket.departmentId) return response.forbidden(res);

            const data : Prisma.TicketUpdateInput = {
                status: StatusTicket.IN_PROGRESS,
                assignedAt: new Date(),
                agent: {
                    connect: {
                        id: user.id
                    }
                }
            }
            const result = await TicketService.update(idNumber, data);

            response.success(res, result, "Success to change tickets status to in progress")

        } catch(error) {
            response.error(res, error, "Failed to change tickets status to in progress");
        }
    },

    waiting: async(req: IReqUserPlusTicket, res:Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if(!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if(!user || !user.departmentId) return response.forbidden(res);

            if(user.departmentId !== ticket.departmentId) return response.forbidden(res);

            const data :Prisma.TicketUpdateInput = {
                status: StatusTicket.WAITING
            }
            const result = await TicketService.update(idNumber, data);

            response.success(res, result, "Success to change tickets status to in waiting")

        } catch(error) {
            response.error(res, error, "Failed to change tickets status to in waiting");
        }
    },

    resolved: async(req: IReqUserPlusTicket, res:Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if(!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if(!user || !user.departmentId) return response.forbidden(res);

            if(user.departmentId !== ticket.departmentId) return response.forbidden(res);

            const data :Prisma.TicketUpdateInput = {
                status: StatusTicket.RESOLVED,
                resolvedAt: new Date()
            }
            const result = await TicketService.update(idNumber, data);

            response.success(res, result, "Success to change tickets status to in resolved")

        } catch(error) {
            response.error(res, error, "Failed to change tickets status to in resolved");
        }
    },

    reProgress: async (req:IReqUserPlusTicket, res:Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if(!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if(!user || !user.departmentId) return response.forbidden(res);

            if(user.departmentId !== ticket.departmentId) return response.forbidden(res);
            

             const data :Prisma.TicketUpdateInput = {
                status: StatusTicket.IN_PROGRESS,
            }
            const result = await TicketService.update(idNumber, data);

            response.success(res, result, "Success to change tickets status to in closed")

        } catch(error) {
            response.error(res, error, "Failed to change back tickets status to in progress");
        }
    },

    reOpen: async (req:IReqUserPlusTicket, res:Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if(!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if(!user) return response.notFound(res, "User tidak ditemukan")

            if(user.id !== ticket.employeeId) return response.forbidden(res);
            

             const data :Prisma.TicketUpdateInput = {
                status: StatusTicket.IN_PROGRESS,
            }
            const result = await TicketService.update(idNumber, data);

            response.success(res, result, "Success to change tickets status to in closed")

        } catch(error) {
            response.error(res, error, "Failed to change back tickets status to in progress");
        }
    },

    closed: async(req: IReqUserPlusTicket, res:Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if(!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if(!user) return response.notFound(res, "User tidak ditemukan")

            if(user.id !== ticket.employeeId) return response.forbidden(res);

            const data :Prisma.TicketUpdateInput = {
                status: StatusTicket.CLOSED,
                closedAt: new Date()
            }
            const result = await TicketService.update(idNumber, data);

            response.success(res, result, "Success to change tickets status to in closed")

        } catch(error) {
            response.error(res, error, "Failed to change tickets status to in closed");
        }
    },

    cancelled: async(req: IReqUserPlusTicket, res:Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if(!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if(!user) return response.notFound(res, "User tidak ditemukan")

            if(user.id !== ticket.employeeId) return response.forbidden(res);

            const data :Prisma.TicketUpdateInput = {
                status: StatusTicket.CANCELLED
            }
            const result = await TicketService.update(idNumber, data);

            response.success(res, result, "Success to change tickets status to in cancelled")

        } catch(error) {
            response.error(res, error, "Failed to change tickets status to in cancelled");
        }
    },
}


export default ticketController;