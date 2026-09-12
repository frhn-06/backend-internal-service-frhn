import z from "zod";
import { TicketDTO } from "../validations/ticket.validation.js";
import prisma from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";
import generateTicketNumber from "../utils/ticketnumber.js";

const TicketService = {
    create: async (employeeId: number, data: z.infer<typeof TicketDTO>) => {
        try {
            const number = generateTicketNumber();
            return await prisma.ticket.create({
                data: {
                    ...data,
                    number,
                    employeeId
                },
                include: {
                    employee: {
                        select: {
                            name: true
                        }
                    }
                }
            })
        }catch(error) {
            throw error
        }
    },



    findByRole: async(query: Prisma.TicketWhereInput, page: number, limit: number) => {
        try {
            return await prisma.ticket.findMany({
                where: query,
                include: {
                    agent: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    employee: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    department: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: limit,
                skip: (page - 1) * limit
            })
        } catch(error) {
            throw error;
        }
    },


    findById: async(id:number, query?: Prisma.TicketWhereInput) => {
        try {
            return await prisma.ticket.findFirst({
                where: {
                    id,
                    ...(query && {
                        ...query
                    })
                },
                include: {
                    department: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    agent: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                    employee: {
                        select: {
                            id: true,
                            name: true
                        }
                    },
                }
            })
        } catch (error) {
            throw error
        }
    },


    findByIdWithMessages: async(id: number, query?: Prisma.TicketWhereInput) => {
        try {
            return await prisma.ticket.findFirst({
                where: {
                    id,
                    ...(query && {...query})
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    messages: {
                        select: {
                            content: true,
                            sender: {
                                select: {
                                    name: true,
                                    role: true
                                }
                            },
                            createdAt: true
                        }
                    }
                }
            })
        } catch(error) {
            throw error;
        }
    },



    update: async(id: number, data: Prisma.TicketUpdateInput) => {
        try {
            return await prisma.ticket.update({
                where: {
                    id
                }, 
                data
            })
        } catch(error) {
            throw error;
        }
    },




    counttotal: async(query: Prisma.TicketWhereInput) => {
        try {
            return await prisma.ticket.count({
                where: query
            });
        }catch(error) {
            throw error;
        }
    }
}

export default TicketService;