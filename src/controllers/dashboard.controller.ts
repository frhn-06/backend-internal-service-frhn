import { Response } from "express";
import { IreqUser, IReqUserPlusTicket } from "../types/user.js";
import response from "../utils/response.js";
import prisma from "../config/prisma.js";
import { StatusTicket, UserRole } from "../generated/prisma/enums.js";
import TicketService from "../services/ticket.service.js";
import UserService from "../services/user.service.js";

const dashboardController = {
    employee: async (req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const [
                totalTickets,
                ticketsOpen,
                ticketsInprogress,
                ticketsResolved,
                ticketsWaiting
            ] = await prisma.$transaction(async (tx) => {
                return [
                    await TicketService.countInTransactionEmployee({
                        tx, userId
                    }),

                    await TicketService.countInTransactionEmployee({
                        tx, userId, status: StatusTicket.OPEN
                    }),

                    await TicketService.countInTransactionEmployee({
                        tx, userId, status: [StatusTicket.IN_PROGRESS, StatusTicket.RE_PROGRESS, StatusTicket.WAITING]
                    }),

                    await TicketService.countInTransactionEmployee({
                        tx, userId, status: StatusTicket.RESOLVED
                    }),

                    await TicketService.countInTransactionEmployee({
                        tx, userId, status: StatusTicket.WAITING
                    })
                ]
            });

            const recentTickets = await TicketService.findRecents({
                userId,
                role: UserRole.EMPLOYEE
            })

            const waitingTickets = await TicketService.findWhereWaiting({
                userId,
                role: UserRole.EMPLOYEE
            })

            response.success(res, {
                statistics: {
                    totalTickets,
                    ticketsOpen,
                    ticketsInprogress,
                    ticketsResolved,
                    ticketsWaiting
                },
                recentTickets,
                waitingTickets
            }, "Success to get data dashboard employee")

        } catch(error) {
            response.error(res, error, "Failed to get data dashboard employee");
        }
    },



    agent: async (req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const agent = await UserService.getUserById(userId);
            if(!agent) return response.notFound(res, "Agent tidak ditemukan");

            const [
                totalTickets,
                ticketsOpen,
                myTickets,
                ticketsResolved,
                ticketsWaiting,
                ticketsReprogress
            ] = await prisma.$transaction(async (tx) => {
                return [
                    await TicketService.countInTransactionAgent({
                        tx, 
                        userId,
                        status: [StatusTicket.IN_PROGRESS, StatusTicket.OPEN, StatusTicket.WAITING, StatusTicket.RE_PROGRESS, StatusTicket.RESOLVED]
                    }),

                    await TicketService.countInTransactionAgent({
                        tx, 
                        status: StatusTicket.OPEN, 
                        departmentId: Number(agent.departmentId)
                    }),

                    await TicketService.countInTransactionAgent({
                        tx, 
                        userId, 
                        status: [StatusTicket.IN_PROGRESS, StatusTicket.WAITING, StatusTicket.RE_PROGRESS]
                    }),

                    await TicketService.countInTransactionAgent({
                        tx, 
                        userId, 
                        status: StatusTicket.RESOLVED
                    }),

                    await TicketService.countInTransactionAgent({
                        tx,
                        userId, 
                        status: StatusTicket.WAITING
                    }),

                    await TicketService.countInTransactionAgent({
                        tx, 
                        userId, 
                        status: StatusTicket.RE_PROGRESS
                    })
                ]
            });

            const recentTickets = await TicketService.findRecents({
                userId,
                role: UserRole.AGENT,
            });

            const waitingTickets = await TicketService.findWhereWaiting({
                userId,
                role: UserRole.AGENT
            })


            const reProgressTickets = await TicketService.findWhereReProgress({
                userId,
                role: UserRole.AGENT
            })


            response.success(res, {
                statistics: {
                    totalTickets,
                    ticketsOpen,
                    myTickets,
                    ticketsWaiting,
                    ticketsReprogress,
                    ticketsResolved
                },
                recentTickets,
                waitingTickets,
                reProgressTickets
            }, "Success to get data dashboard agent")

            
        } catch(error) {
            response.error(res, error, "Failed to get data dashboard agent");
        }
    }
}


export default dashboardController;