import z from "zod";
import prisma from "../config/prisma.js"
import { Prisma } from "../generated/prisma/client.js";
import { RegisterDTO, UserDTO } from "../validations/user.validation.js";
import { hashPassword } from "../utils/bcrypt.js";

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

    update: async(params: {
        userId: number; 
        data: Partial<z.infer<typeof UserDTO>>
    }) => {
        try {
            return await prisma.user.update({
                where: {
                    id: params.userId,
                    isActive: true
                },
                data: params.data,
                omit: {
                    password: true
                }
            })
        } catch(error) {
            throw error;
        }
    },

    updatePassword: async(params: {
        userId: number;
        passwordHashed: string
    }) => {
        try {            
            return await prisma.user.update({
                where: {
                    id: params.userId,
                    isActive: true
                },
                data: {
                    password: params.passwordHashed
                },
                omit: {
                    password: true
                }
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