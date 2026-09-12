import { NotificationType } from "../generated/prisma/enums.ts";

interface INotificationParams {
    actorId: number;
    targetId: number;
    ticketId: number;
    title: string;
    message: string;
    type: NotificationType;
}

export type {INotificationParams}