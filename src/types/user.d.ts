import { Request } from "express";
import { IUserToken } from "../utils/jwt.ts";

interface IreqUser extends Request {
    user?: IUserToken;
}

export type {IreqUser}