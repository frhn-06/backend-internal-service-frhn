import {z} from 'zod'
import { MessageDTO } from '../validations/message.validation.js'
import prisma from '../config/prisma.js'

const MessageService = {
    create: async(senderId: number, ticketId: number, data: z.infer<typeof MessageDTO>) => {
        try {
            return await prisma.message.create({
                data: {
                    content: data.content,
                    ticketId: ticketId,
                    senderId: senderId
                },
                include: {
                    sender: {
                        select: {
                            name: true
                        }
                    }
                }
            })
        } catch(error) {
            throw error
        }
    },

    findMany: async(ticketId: number) => {
        try {
            return await prisma.message.findMany({
                where: {
                    ticketId
                },
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    },
                    ticket: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            priority: true
                        }
                    }
                }
            })
        } catch(error) {
            throw error
        }
    },


    findManyWithPagination: async(ticketId: number, page: number, limit: number) => {
        try {
            const messages = await prisma.message.findMany({
                where: {
                    ticketId
                },
                skip: (page - 1) * limit,
                take: limit + 1, 
                include: {
                    sender: {
                        select: {
                            id: true,
                            name: true,
                            role: true
                        }
                    },
                    ticket: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            priority: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })

            const hasNextPage = messages.length > limit;

            const data = messages.slice(0, limit).reverse();

            return {
                data,
                limit,
                page,
                hasNextPage
            }
        } catch(error) {
            throw error
        }
    }
}


export default MessageService;