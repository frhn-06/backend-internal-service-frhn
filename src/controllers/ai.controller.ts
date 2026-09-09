import { Response } from "express";
import { IReqUserPlusTicket } from "../types/user.js";
import response from "../utils/response.js";
import TicketService from "../services/ticket.service.js";
import AiService from "../services/ai.service.js";

const aiController = {
    generate: async(req:IReqUserPlusTicket, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Ticket tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const ticket = await TicketService.findByIdWithMessages(idNumber);
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            const result = await AiService.generateReply(ticket);

            response.success(res, result, "Success to generate ai")
            
        } catch(error) {
            response.error(res, error, "Failed to generate ai")
        }
    }
}

export default aiController;