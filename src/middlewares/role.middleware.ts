import { NextFunction, Response } from "express"
import { IreqUser } from "../types/user.js"
import response from "../utils/response.js";

const roleMiddleware = (roles: string[]) => {
    return (req: IreqUser, res:Response, next:NextFunction) => {
        const role = req.user?.role;
        if(!role) return response.unauthorize(res);

        if(!roles.includes(role)) return response.forbidden(res);

        next();
    }
}

export default roleMiddleware;