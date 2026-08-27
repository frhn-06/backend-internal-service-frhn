import { NextFunction, Response, Request } from "express";
import response from "../utils/response.js";

const errorMiddleware = {
    routeError: () => {
        return (req: Request, res:Response, next: NextFunction) => {
            response.error(res, false, "route tidak ada");
        }
    },

    serverError: () => {
        return (error : Error,  req: Request, res:Response, next: NextFunction) => {
            response.error(res, error, "serror server");
        }
    }
}

export default errorMiddleware;