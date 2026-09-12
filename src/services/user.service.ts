import prisma from "../config/prisma.js"
import { Prisma } from "../generated/prisma/client.js";

const UserService = {
    getUserById: async(id: number, query?: Prisma.UserWhereInput) => {
        try {
            return await prisma.user.findFirst({
                where: {
                    id: id,
                    ...(query && {...query})
                },
                include: {
                    department: {
                        select: {
                            name: true
                        }
                    }
                },
                omit: {
                    password: true
                }
            });
        } catch(error) {
            throw error
        }
    },

    findAll: async(query: Prisma.UserWhereInput, page: number, limit: number) => {
        try {
            return await prisma.user.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                omit: {
                    password: true
                },
                include: {
                    department: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: [
                    {
                        departmentId: "asc"
                    }, 
                    {
                        name: "asc"
                    }
                ]
            })
        } catch(error) {
            throw error
        }
    },


    findAllForNotification: async(query: Prisma.UserWhereInput) => {
        try {
            return await prisma.user.findMany({
                where: query,
                select: {
                    id: true,
                    name: true,
                    departmentId: true
                }
            })
        } catch(error) {
            throw error
        }
    },

    delete: async(id: number) => {
        try {
            return await prisma.user.delete({
                where: {
                    id
                },
                omit: {
                    password: true
                }
            })
        } catch(error) {
            throw error
        }
    },

    countTotal: async(query: Prisma.UserWhereInput) => {
        try {
            return await prisma.user.count({
                where: query
            });
        } catch(error) {
            throw error
        }
    },

    updateStatus: async (id: number, isActive: boolean) => {
        try {
            return await prisma.user.update({
                where: {
                    id
                },
                data: {
                    isActive
                },
                omit: {
                    password: true
                }
            });
        } catch(error) {
            throw error
        }
    }
}

export default UserService;