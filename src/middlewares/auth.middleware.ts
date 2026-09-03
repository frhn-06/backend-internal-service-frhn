import { NextFunction, Request, Response } from "express";
import response from "../utils/response.js";
import { getUserByToken } from "../utils/jwt.js";
import { IreqUser } from "../types/user.js";

const authMiddleware = async (req:Request, res:Response, next: NextFunction) => {
    const authorized = req.headers.authorization;
    if(!authorized) return response.unauthorize(res);

    const [bearer, token] = authorized.split(" ");
    if(bearer !== "Bearer" || !token) return response.unauthorize(res);

    try {
        const user = await getUserByToken(token);

        (req as unknown as IreqUser ).user = user;
        

        next();
    } catch (error) {
        next(error)
    }
    
}

export default authMiddleware