import { Response } from "express";
import { IreqUser, IReqUserPlusTicket } from "../types/user.js";
import response from "../utils/response.js";
import TicketService from "../services/ticket.service.js";
import { MessageDTO } from "../validations/message.validation.js";
import MessageService from "../services/message.service.js";
import NotificationService from "../services/notification.service.js";
import { NotificationType } from "../generated/prisma/enums.js";
import { getIo } from "../socket/index.js";

const messageController = {
    create: async(req:IReqUserPlusTicket, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId || Number.isNaN(userId)) return response.notFound(res, "User tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const ticket = await TicketService.findById(idNumber);
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const validate = MessageDTO.parse(req.body);

            const result = await MessageService.create(userId, ticket.id, validate);

            // notification
            let targetId: number;
            if(req.user?.role === "AGENT") {
                targetId = ticket.employeeId;
            } else {
                if(!ticket.agentId) return response.notFound(res, "Agent tidak ditemukan");
                targetId = ticket.agentId
            }
            await NotificationService.create({
                type: NotificationType.MESSAGE_RECEIVED,
                title: "Pesan baru",
                message: `Pesan baru dari ${result.sender.name}`,
                actorId: userId,
                targetId: targetId,
                ticketId: ticket.id
            })

            // notification

            // socket
            const io = getIo();

            io.to(`user:${targetId}`).emit("notification:new");

            io.to(`ticket:${ticket.id}`).emit("message:new");

            io.to(`user:${targetId}`).emit("all-messages:new");
            // socket
            


            response.success(res, result, "Success to send message");

        }catch(error) {
            response.error(res, error, "Failed to send message");
        }
    },

    findMany: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            const idNumber = Number(id);
            if(!id || Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const result = await MessageService.findMany(idNumber);
            if(!result) return response.notFound(res, "Message tidak ditemukan");

            response.success(res, result, "Success to send message");
        } catch(error) {
            response.error(res, error, "Failed to send message");
        }
    },


    findManyWithPagination: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            const idNumber = Number(id);
            if(!id || Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");
            
            const {page, limit} = req.query as { page?: string, limit?: string };
            const pageNumber = Number(page) || 1;
            if(pageNumber < 1) return response.error(res, false, "Page tidak valid");
            const limitNumber = Number(limit) || 20;
            if(limitNumber < 1 || limitNumber > 50) return response.error(res, false, "Limit tidak valid");

            const result = await MessageService.findManyWithPagination(idNumber, pageNumber, limitNumber);
            

            response.success(res, result, "Success to send message");
        } catch(error) {
            response.error(res, error, "Failed to send message");
        }
    }

}




export default messageController;