import { Server as HttpServer } from "http"
import { Server, Socket } from "socket.io";
import { CLIENT_URL, JWT_SECRET } from "../utils/env.js";
import { UserRole } from "../generated/prisma/enums.js";
import jwt from "jsonwebtoken";

interface ISocketUser {
    id: number;
    role: UserRole;
}

interface IAuthSocket extends Socket {
    user?: ISocketUser;
}


let io: Server;

const initializeSocket = (server: HttpServer) => {
    io = new Server(server, {
        cors: {
            origin: CLIENT_URL
        }
    });



    io.use((socket, next) => {
        const authSocket = socket as IAuthSocket;
        const tokenFromFe = socket.handshake.auth.token;

        try {
            const userHasilJwt = jwt.verify(tokenFromFe, JWT_SECRET) as ISocketUser;

            authSocket.user = userHasilJwt;

            next();
        } catch (error) {
            next(new Error("Unauthorized"));
        }
    })


    io.on("connection", (socket) => {
        const userId = (socket as IAuthSocket).user?.id;

        socket.join(`user:${userId}`);

        socket.on("ticket:join", (ticketId) => {
           
            socket.join(`ticket:${ticketId}`);
            
        })

        socket.on("disconnect", () => {
            console.log(`klient yang ber id ${socket.id} putus koneksi`)
        })
    });


    return io;
}

const getIo = () => {
    return io
}


export {initializeSocket, getIo}