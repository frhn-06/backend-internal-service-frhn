import prisma from "../config/prisma.js"
import { NotificationType } from "../generated/prisma/enums.js"
import { INotificationParams } from "../types/notification.js"

const NotificationService = {
    create: async(params: INotificationParams) => {
        try {
            return await prisma.notification.create({
                data: {
                    ticketId: params.ticketId,
                    title: params.title,
                    message: params.message,
                    type: params.type,
                    targetId: params.targetId,
                    actorId: params.actorId
                }
            })
        } catch(error) {
            throw error
        }
    },


    findAll: async (userId: number) => {
        try {
            return await prisma.notification.findMany({
                where: {
                    targetId: userId,
                    NOT: [
                        {
                            type: NotificationType.MESSAGE_RECEIVED
                        }
                    ]
                },
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    target: {
                        select: {
                            role: true
                        }
                    }
                }
            })
        } catch(error) {
            throw error
        }
    },




    countAll: async(userId: number) => {
        try {
            return await prisma.notification.count({
                where: {
                    targetId: userId,
                    NOT: [
                        {
                            type: NotificationType.MESSAGE_RECEIVED
                        }
                    ],
                    isRead: false
                }
            })
        } catch(error) {
            throw error
        }
    },


    countMessage: async(userId: number) => {
        try {
            const result = await prisma.notification.groupBy({
                by: ["ticketId"],
                where: {
                    targetId: userId,
                    type: NotificationType.MESSAGE_RECEIVED,
                    isRead: false
                }
            })
            return result.length;
        } catch(error) {
            throw error
        }
    },


    findById: async(id: number) => {
        try {
            return await prisma.notification.findUnique({
                where: {
                    id
                }
            })
        } catch(error) {
            throw error;
        }
    },


    countMessageByTicket: async(userId: number) => {
        try {
            return await prisma.notification.groupBy({
                by: ["ticketId"],
                where: {
                    targetId: userId,
                    type: NotificationType.MESSAGE_RECEIVED,
                    isRead: false
                },
                _count: {
                    _all: true
                },
            })
        } catch(error) {
            throw error
        }
    },






    readNotificationById: async(params: {
        id: number;
        targetId: number
    }) => {
        try {
            return await prisma.notification.updateMany({
                where: {
                    id: params.id,
                    targetId: params.targetId,
                    isRead: false
                },
                data: {
                    isRead: true
                }
            })
        } catch(error) {
            throw error
        }
    },


    readMessageNotification: async(params: {
        ticketId: number;
        targetId: number
    }) => {
        try {
            return await prisma.notification.updateMany({
                where: {
                    ticketId: params.ticketId,
                    type: NotificationType.MESSAGE_RECEIVED,
                    targetId: params.targetId,
                    isRead: false
                },
                data: {
                    isRead: true
                }
            })
        } catch(error) {
            throw error
        }
    }
}

export default NotificationService