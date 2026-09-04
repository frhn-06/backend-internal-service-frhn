import { Request } from "express";
import { IUserToken } from "../utils/jwt.ts";
import TicketService from "../services/ticket.service.ts";

interface IreqUser extends Request {
    user?: IUserToken;
}

interface IReqUserPlusTicket extends IreqUser {
    ticket?: Awaited<ReturnType<typeof TicketService.findById>>
}

export type {IreqUser, IReqUserPlusTicket}