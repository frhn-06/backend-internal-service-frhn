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
                    }
                }
            })
        } catch(error) {
            throw error
        }
    }
}


export default MessageService;