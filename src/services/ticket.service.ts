import z from "zod";
import { TicketDTO } from "../validations/ticket.validation.js";
import prisma from "../config/prisma.js";
import { Prisma, PrismaClient, StatusTicket, UserRole } from "../generated/prisma/client.js";
import generateTicketNumber from "../utils/ticketnumber.js";
import { GlobalOmitConfig, TicketScalarFieldEnum } from "../generated/prisma/internal/prismaNamespace.js";
import { DefaultArgs } from "@prisma/client/runtime/wasm-compiler-edge";

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
    },





    findRecents: async (params: {
        userId: number,
        role: UserRole
    }) => {
        try {
            let query: Prisma.TicketWhereInput = {};

            switch(params.role) {
                case UserRole.EMPLOYEE :
                    query = {
                        employeeId: params.userId
                    }
                    break;
                case UserRole.AGENT :
                    query = {
                       agentId: params.userId,
                       status: {
                        notIn: [StatusTicket.CANCELLED, StatusTicket.CLOSED]
                       }
                    }
                    break;
                case UserRole.ADMIN :
                    query = {
                        status: {
                            notIn: [StatusTicket.CANCELLED, StatusTicket.CLOSED]
                        }
                    }
                    break;
            }

            return await prisma.ticket.findMany({
                where: query,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    agent: {
                        select: {
                            name: true
                        }
                    },
                    category: {
                        select: {
                            name: true
                        }
                    },
                    department: {
                        select: {
                            name: true
                        }
                    },
                },
                take: 5
            });
        } catch(error) {
            throw error;
        }
    },

    
    findWhereWaiting: async (params: {
        userId: number,
        role: UserRole
    }) => {
        let query: Prisma.TicketWhereInput = {};

        switch(params.role) {
            case UserRole.EMPLOYEE :
                query = {
                    employeeId: params.userId,
                    status: StatusTicket.WAITING
                }
                break;
            case UserRole.AGENT :
                query = {
                    agentId: params.userId ,
                    status: StatusTicket.WAITING
                }
                break;
        }

        try {
            return await prisma.ticket.findMany({
                where: query,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    agent: {
                        select: {
                            name: true
                        }
                    },
                    category: {
                        select: {
                            name: true
                        }
                    },
                    department: {
                        select: {
                            name: true
                        }
                    },
                },
                take: 5
            });
        } catch(error) {
            throw error
        }
    },


    findWhereReProgress: async (params: {
        userId: number,
        role: UserRole
    }) => {
        let query: Prisma.TicketWhereInput = {};

        switch(params.role) {
            case UserRole.EMPLOYEE :
                query = {
                    employeeId: params.userId,
                    status: StatusTicket.RE_PROGRESS
                }
                break;
            case UserRole.AGENT :
                query = {
                    agentId: params.userId ,
                    status: StatusTicket.RE_PROGRESS
                }
                break;
        }

        try {
            return await prisma.ticket.findMany({
                where: query,
                orderBy: {
                    createdAt: "desc"
                },
                include: {
                    agent: {
                        select: {
                            name: true
                        }
                    },
                    category: {
                        select: {
                            name: true
                        }
                    },
                    department: {
                        select: {
                            name: true
                        }
                    },
                },
                take: 5
            });
        } catch(error) {
            throw error
        }
    },


   countInTransactionEmployee: async (params : {
        tx: Omit<PrismaClient<never, GlobalOmitConfig | undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">,
        userId: number;
        status?: StatusTicket | StatusTicket[];
   }) => {
        let query : Prisma.TicketWhereInput = {
            employeeId: params.userId,
        }

        if(Array.isArray(params.status)) {
            query = {
                ...query,
                status: {
                    in: params.status
                }
            }
        } else {
            query = {
                ...query,
                status: params.status
            }
        }

        try {
            return await params.tx.ticket.count({
                where: query
            })
        } catch(error) {
            throw error;
        }
   },



   countInTransactionAgent: async (params : {
        tx: Omit<PrismaClient<never, GlobalOmitConfig | undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">,
        userId?: number;
        status?: StatusTicket | StatusTicket[];
        departmentId?: number;
   }) => {

        let query: Prisma.TicketWhereInput = {
            ...(params.userId && {
                agentId: params.userId
            }),
            ...(params.departmentId && {
                departmentId: params.departmentId
            }),
        };
        if(Array.isArray(params.status)) {
            query = {
                ...query,
                status: {
                    in: params.status
                }
            }
        } else {
            query = {
                ...query,
                status: params.status
            }
        }
        try {

            return await params.tx.ticket.count({
                where: query
            })
        } catch(error) {
            throw error;
        }
   },



   countInTransactionAdmin: async(params: {
        tx: Omit<PrismaClient<never, GlobalOmitConfig | undefined, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$use" | "$extends">,
        status?: StatusTicket | StatusTicket[];
   }) => {
        try {
            let query :Prisma.TicketWhereInput = {}
            if(params.status && Array.isArray(params.status)) {
                query = {
                    ...query,
                    status: {
                        in: params.status
                    }
                }
            } else if (params.status && !Array.isArray(params.status)){
                query = {
                    ...query,
                    status: params.status
                }
            }

            return await params.tx.ticket.count({
                where: query
            })
        }catch(error) {
            throw error
        }
   },



    groupBy: async (by: TicketScalarFieldEnum[]) => {
        try{
            return await prisma.ticket.groupBy({
                by: by,
                _count: {
                    id: true
                }
            });

        }catch(error) {
            throw error;
        }
    },


}

export default TicketService;