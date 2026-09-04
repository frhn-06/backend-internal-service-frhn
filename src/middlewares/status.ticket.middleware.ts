import { NextFunction, Response } from "express";
import { StatusTicket } from "../generated/prisma/enums.js";
import { IreqUser, IReqUserPlusTicket } from "../types/user.js";
import response from "../utils/response.js";
import TicketService from "../services/ticket.service.js";

const statusTicketMiddleware = (status: StatusTicket[]) => {
    return async (req: IreqUser, res: Response, next:NextFunction) => {
        try {
            const {id} = req.params;
            const idNumber = Number(id);
            if(!id || Number.isNaN(idNumber)) return response.notFound(res, "Ticket tidak ditemukan");
            
            const ticket = await TicketService.findById(idNumber);
            if(!ticket) return response.notFound(res, "Ticket tidak ditemukan");

            if(!status.includes(ticket.status)) return response.error(res, false, "Perubahan status ticket tidak diizinkan");

            (req as unknown as IReqUserPlusTicket).ticket = ticket
            next();
        } catch(error) {
            next(error);
        }
    }
}

export default statusTicketMiddleware;