import { Response } from "express";
import { IreqUser, IReqUserPlusTicket } from "../types/user.js";
import response from "../utils/response.js";
import { TicketDTO } from "../validations/ticket.validation.js";
import DepartmentService from "../services/department.service.js";
import CategoryService from "../services/category.service.js";
import TicketService from "../services/ticket.service.js";
import { NotificationType, Prisma, StatusTicket, UserRole } from "../generated/prisma/client.js";
import UserService from "../services/user.service.js";
import NotificationService from "../services/notification.service.js";
import { getIo } from "../socket/index.js";




const ticketController = {
    create: async (req: IreqUser, res: Response) => {
        try {
            const id = req.user?.id;
            if (!id) return response.notFound(res, "Employee tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Employee tidak ditemukan");

            const validate = TicketDTO.parse(req.body);

            const department = await DepartmentService.findById(validate.departmentId);
            if (!department) return response.notFound(res, "Department tidak ditemukan");

            const query = {
                id: validate.categoryId,
                departmentId: department.id,
                isActive: true
            }

            const category = await CategoryService.findByQuery(query);
            if (!category) return response.notFound(res, "Category tidak ditemukan");

            const result = await TicketService.create(idNumber, validate);


            // notification
            const agents = await UserService.findAllForNotification({
                isActive: true,
                departmentId: result.departmentId
            });

            await Promise.all(agents.map((agent) => {
                return NotificationService.create({
                    targetId: agent.id,
                    actorId: result.employeeId,
                    type: NotificationType.TICKET_CREATED,
                    ticketId: result.id,
                    title: "Tiket dibuat",
                    message: `Ticket dibuat oleh ${result.employee.name}`
                })
            }))
            // notification

            // socket
            const io = getIo();
            agents.forEach((agent) => {
                io.to(`user:${agent.id}`).emit("notification:new")
                io.to(`user:${agent.id}`).emit("toast:new", {
                    type: "notification",
                    title: "Tiket Baru",
                    description: `Tiket dibut oleh ${result.employee.name}.`
                })
            })
            // socket

            // response
            response.success(res, result, "Success to create ticket")

        } catch (error) {
            response.error(res, error, "Failed to create ticket");
        }
    },


    findByRole: async (req: IreqUser, res: Response) => {
        try {
            const id = req.user?.id;
            if (!id) return response.notFound(res, "User tidak ditemukan");

            const role = req.user?.role;
            if (!role) return response.notFound(res, "User tidak ditemukan");

            const {
                page = 1,
                limit = 32,
                status,
                priority,
                search
            } = req.query;

            const numberPage = Number(page);
            const numberLimit = Number(limit);
            if (Number.isNaN(numberPage) || Number.isNaN(numberLimit)) return response.notFound(res, "Tickets tidak ditemukan")

            const user = await UserService.getUserById(id);
            if (!user) return response.notFound(res, "User tidak ditemukan");

            const setQuery = () => {
                let query: Prisma.TicketWhereInput = {};


                if (role === UserRole.AGENT) {
                    if (!user.departmentId) {
                        throw Error("Agent tidak memiliki department");
                    }

                    query.agentId = user.id;
                }

                if (role === UserRole.EMPLOYEE) query.employeeId = id

                if (status === "OPEN" ||
                    status === "IN_PROGRESS" ||
                    status === "WAITING" ||
                    status === "RESOLVED" ||
                    status === "CLOSED" ||
                    status === "CANCELLED"
                ) query.status = status

                if (priority === "LOW" ||
                    priority === "HIGH" ||
                    priority === "MEDIUM" ||
                    priority === "URGENT"
                ) query.priority = priority

                if (search && typeof search === "string") {
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


        } catch (error) {
            response.error(res, error, "Failed to find tickets");
        }
    },


    findByDepartment: async (req: IreqUser, res: Response) => {
        try {
            const id = req.user?.id;
            if (!id) return response.notFound(res, "User tidak ditemukan");

            const role = req.user?.role;
            if (!role) return response.notFound(res, "User tidak ditemukan");

            const {
                page = 1,
                limit = 32,
                status,
                priority,
                search
            } = req.query;

            const numberPage = Number(page);
            const numberLimit = Number(limit);
            if (Number.isNaN(numberPage) || Number.isNaN(numberLimit)) return response.notFound(res, "Tickets tidak ditemukan")


            const user = await UserService.getUserById(id);
            if (!user) return response.notFound(res, "User tidak ditemukan");
            if (!user.departmentId) return response.error(res, false, "Agent belum memiliki department");

            const setQuery = () => {
                let query: Prisma.TicketWhereInput = {
                    departmentId: user.departmentId as unknown as Prisma.IntFilter<"Ticket">
                };

                if (status === "OPEN" ||
                    status === "IN_PROGRESS" ||
                    status === "WAITING" ||
                    status === "RESOLVED" ||
                    status === "CLOSED" ||
                    status === "CANCELLED"
                ) query.status = status

                if (priority === "LOW" ||
                    priority === "HIGH" ||
                    priority === "MEDIUM" ||
                    priority === "URGENT"
                ) query.priority = priority

                if (search && typeof search === "string") {
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


        } catch (error) {
            response.error(res, error, "Failed to find tickets");
        }
    },


    findById: async (req: IreqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if (!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");
            const { id } = req.params;
            if (!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const role = req.user?.role;

            const user = await UserService.getUserById(userIdNumber);
            if (!user) return response.notFound(res, "User tidak ditemukan")

            const setQuery = () => {
                let query: Prisma.TicketWhereInput = {}

                if (role === UserRole.EMPLOYEE) query.employeeId = userIdNumber;

                if (role === UserRole.AGENT) {
                    if (!user.departmentId) throw Error("Agent tidak memiliki department");
                    query.departmentId = user.departmentId
                }

                return query;
            }

            const query = setQuery()

            const result = await TicketService.findById(idNumber, query);
            if (!result) return response.notFound(res, "Ticket tidak ditemukan");

            response.success(res, result, "Success to find a ticket")
        } catch (error) {
            response.error(res, error, "Failed to find a ticket");
        }
    },



    take: async (req: IReqUserPlusTicket, res: Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if (!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if (!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const { id } = req.params;
            if (!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if (!user || !user.departmentId) return response.forbidden(res);

            if (user.departmentId !== ticket.departmentId) return response.forbidden(res);

            const data: Prisma.TicketUpdateInput = {
                status: StatusTicket.IN_PROGRESS,
                assignedAt: new Date(),
                agent: {
                    connect: {
                        id: user.id
                    }
                }
            }
            const result = await TicketService.update(idNumber, data);


            // notification
            await NotificationService.create({
                targetId: ticket.employeeId,
                actorId: user.id!,
                ticketId: ticket.id,
                title: "Ticket diambil",
                message: `Ticket diambil oleh ${user.name}`,
                type: NotificationType.TICKET_TAKEN
            })
            // notification



            // socket
            const io = getIo();
            io.to(`user:${ticket.employeeId}`).emit("notification:new");

            io.to(`ticket:${ticket.id}`).emit("ticket-status:change");

            io.to(`user:${ticket.employeeId}`).emit("toast:new", {
                type: "notification",
                title: "Tiket Diambil",
                description: `Agent ${user.name} telah mengambil tiket anda untuk ditangani.`
            })
            // socket


            response.success(res, result, "Success to change tickets status to in progress")

        } catch (error) {
            response.error(res, error, "Failed to change tickets status to in progress");
        }
    },

    waiting: async (req: IReqUserPlusTicket, res: Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if (!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if (!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const { id } = req.params;
            if (!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if (!user || !user.departmentId) return response.forbidden(res);

            if (user.departmentId !== ticket.departmentId) return response.forbidden(res);

            const data: Prisma.TicketUpdateInput = {
                status: StatusTicket.WAITING
            }
            const result = await TicketService.update(idNumber, data);

            // notification
            await NotificationService.create({
                targetId: ticket.employeeId,
                actorId: user.id!,
                ticketId: ticket.id,
                title: "Ticket ditunggu",
                message: `Tiket sedang menunggu respons dari Anda`,
                type: NotificationType.TICKET_WAITING
            })
            // notification

            // socket
            const io = getIo();
            io.to(`user:${ticket.employeeId}`).emit("notification:new");

            io.to(`ticket:${ticket.id}`).emit("ticket-status:change");

            io.to(`user:${ticket.employeeId}`).emit("toast:new", {
                type: "notification",
                title: "Menunggu Informasi",
                description: `Agent ${user.name} menunggu informasi tambahan terkait tiket Anda.`
            })
            // socket

            response.success(res, result, "Success to change tickets status to in waiting")

        } catch (error) {
            response.error(res, error, "Failed to change tickets status to in waiting");
        }
    },

    resolved: async (req: IReqUserPlusTicket, res: Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if (!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if (!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const { id } = req.params;
            if (!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if (!user || !user.departmentId) return response.forbidden(res);

            if (user.departmentId !== ticket.departmentId) return response.forbidden(res);

            const data: Prisma.TicketUpdateInput = {
                status: StatusTicket.RESOLVED,
                resolvedAt: new Date()
            }
            const result = await TicketService.update(idNumber, data);

            // notification
            await NotificationService.create({
                targetId: ticket.employeeId,
                actorId: user.id!,
                ticketId: ticket.id,
                title: "Ticket selesai",
                message: `Tiket diselesaikan oleh ${user.name}`,
                type: NotificationType.TICKET_RESOLVED
            })
            // notification

            // socket
            const io = getIo();
            io.to(`user:${ticket.employeeId}`).emit("notification:new");

            io.to(`ticket:${ticket.id}`).emit("ticket-status:change");

            io.to(`user:${ticket.employeeId}`).emit("toast:new", {
                type: "notification",
                title: "Penanganan Selesai",
                description: `Agent ${user.name} telah menyelesaikan penanganan tiket Anda.`
            })
            // socket

            response.success(res, result, "Success to change tickets status to in resolved")

        } catch (error) {
            response.error(res, error, "Failed to change tickets status to in resolved");
        }
    },

    nextProgress: async (req: IReqUserPlusTicket, res: Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if (!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if (!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const { id } = req.params;
            if (!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if (!user || !user.departmentId) return response.forbidden(res);

            if (user.departmentId !== ticket.departmentId) return response.forbidden(res);


            const data: Prisma.TicketUpdateInput = {
                status: StatusTicket.IN_PROGRESS,
            }
            const result = await TicketService.update(idNumber, data);

            // notification
            await NotificationService.create({
                targetId: ticket.employeeId,
                actorId: user.id!,
                ticketId: ticket.id,
                title: "Ticket diproses",
                message: `Ticket diproses oleh ${user.name}`,
                type: NotificationType.TICKET_REOPENED
            })
            // notification

            // socket
            const io = getIo();
            io.to(`user:${ticket.employeeId}`).emit("notification:new");

            io.to(`ticket:${ticket.id}`).emit("ticket-status:change");                                                          

            io.to(`user:${ticket.employeeId}`).emit("toast:new", {
                type: "notification",
                title: "Tiket Sedang Ditangani",
                description: `Agent ${user.name} sedang menangani tiket Anda.`
            })
            // socket

            response.success(res, result, "Success to change tickets status to in closed")

        } catch (error) {
            response.error(res, error, "Failed to change back tickets status to in progress");
        }
    },

    reProgress: async (req: IReqUserPlusTicket, res: Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if (!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if (!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const { id } = req.params;
            if (!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if (!user) return response.notFound(res, "User tidak ditemukan")

            if (user.id !== ticket.employeeId) return response.forbidden(res);


            const data: Prisma.TicketUpdateInput = {
                status: StatusTicket.RE_PROGRESS,
            }
            const result = await TicketService.update(idNumber, data);

            // notification
            await NotificationService.create({
                targetId: ticket.agentId!,
                actorId: ticket.employeeId,
                ticketId: ticket.id,
                title: "Ticket dibuka lagi",
                message: `${user.name} membuka kembali ticket ini`,
                type: NotificationType.TICKET_IN_PROGRESS
            })
            // notification

            // socket
            const io = getIo();
            io.to(`user:${ticket.agentId}`).emit("notification:new")

            io.to(`ticket:${ticket.id}`).emit("ticket-status:change");

            io.to(`user:${ticket.agentId}`).emit("toast:new", {
                type: "notification",
                title: "Tiket Dibuka Kembali",
                description: `${user.name} membuka kembali tiket dan memerlukan tindak lanjut.`
            })
            // socket

            response.success(res, result, "Success to change tickets status to in closed")

        } catch (error) {
            response.error(res, error, "Failed to change back tickets status to in progress");
        }
    },

    closed: async (req: IReqUserPlusTicket, res: Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if (!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if (!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const { id } = req.params;
            if (!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if (!user) return response.notFound(res, "User tidak ditemukan")

            if (user.id !== ticket.employeeId) return response.forbidden(res);

            const data: Prisma.TicketUpdateInput = {
                status: StatusTicket.CLOSED,
                closedAt: new Date()
            }
            const result = await TicketService.update(idNumber, data);

            // notification
            await NotificationService.create({
                targetId: ticket.agentId!,
                actorId: ticket.employeeId,
                ticketId: ticket.id,
                title: "Ticket ditutup",
                message: `${user.name} menutup ticket ini`,
                type: NotificationType.TICKET_CLOSED
            })
            // notification

            // socket
            const io = getIo();
            io.to(`user:${ticket.agentId}`).emit("notification:new");

            io.to(`ticket:${ticket.id}`).emit("ticket-status:change");

            io.to(`user:${ticket.agentId}`).emit("toast:new", {
                type: "notification",
                title: "Tiket Ditutup",
                description: `${user.name} telah menutup tiket yang ditangani.`
            })
            // socket

            response.success(res, result, "Success to change tickets status to in closed")

        } catch (error) {
            response.error(res, error, "Failed to change tickets status to in closed");
        }
    },

    cancelled: async (req: IReqUserPlusTicket, res: Response) => {
        try {
            const userId = req.user?.id;
            const userIdNumber = Number(userId);
            if (!userId || Number.isNaN(userIdNumber)) return response.notFound(res, "User tidak ditemukan");

            const ticket = req.ticket;
            if (!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const { id } = req.params;
            if (!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if (Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const user = await UserService.getUserById(userIdNumber);
            if (!user) return response.notFound(res, "User tidak ditemukan")

            if (user.id !== ticket.employeeId) return response.forbidden(res);

            const data: Prisma.TicketUpdateInput = {
                status: StatusTicket.CANCELLED
            }
            const result = await TicketService.update(idNumber, data);

            const io = getIo();

            // notiifcation & socket
            if (ticket.agentId) {
                await NotificationService.create({
                    targetId: ticket.agentId!,
                    actorId: ticket.employeeId,
                    ticketId: ticket.id,
                    title: "Ticket dibatalkan",
                    message: `${user.name} membatalkan ticket ini`,
                    type: NotificationType.TICKET_CANCELLED
                });

                io.to(`user:${ticket.agentId}`).emit("notification:new")

            } else {
                const agents = await UserService.findAllForNotification({
                    isActive: true,
                    departmentId: ticket.departmentId
                });

                await Promise.all(agents.map((agent) =>
                    NotificationService.create({
                        targetId: agent.id!,
                        actorId: ticket.employeeId,
                        ticketId: ticket.id,
                        title: "Ticket dibatalkan",
                        message: `${user.name} membatalkan ticket ini`,
                        type: NotificationType.TICKET_CANCELLED
                    })
                ));

                agents.forEach((agent) => {
                    io.to(`user:${agent.id}`).emit("notification:new");
                })
                io.to(`ticket:${ticket.id}`).emit("ticket-status:change");
            }
            // notification & socket

            response.success(res, result, "Success to change tickets status to in cancelled")

        } catch (error) {
            response.error(res, error, "Failed to change tickets status to in cancelled");
        }
    },
}


export default ticketController;