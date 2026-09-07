import { Response } from "express";
import { IreqUser, IReqUserPlusTicket } from "../types/user.js";
import response from "../utils/response.js";
import TicketService from "../services/ticket.service.js";
import { MessageDTO } from "../validations/message.validation.js";
import MessageService from "../services/message.service.js";

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
    }
}




export default messageController;