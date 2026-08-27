import z from "zod";
import { DepartmentDTO } from "../validations/department.validation.js";
import prisma from "../config/prisma.js";
import { Prisma } from "../generated/prisma/client.js";

const DepartmentService = {
    create: async (data: z.infer<typeof DepartmentDTO>) => {
        try {
            return await prisma.department.create({
                data: data
            });
        } catch (error) {
            throw error
        }
    },


    findMany: async (query: Prisma.DepartmentWhereInput, page: number, limit: number) => {
        try {
            return await prisma.department.findMany({
                where: query,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: {
                    createdAt: "desc"
                }
            });
        } catch(error) {
            throw error
        }
    },

    findById: async (id: number) => {
        try {
            return await prisma.department.findUnique({
                where: {
                    id: id
                }
            })
        }catch(error) {
            throw error
        }
    },

    update: async(id: number, data: Partial<z.infer<typeof DepartmentDTO>>) => {
        try {
            return await prisma.department.update({
                where: {
                    id
                },
                data: data
            })
        } catch(error) {
            throw error
        }
    },

    delete: async(id:number) => {
        try {
            return await prisma.department.delete({
                where: {
                    id: id
                }
            })
        } catch(error) {
            throw error
        }
    },

    countTotal: async (query: Prisma.DepartmentWhereInput) => {
        try {
            return await prisma.department.count({
                where: query
            })
        } catch(error) {
            throw error
        }
    }
}

export default DepartmentService;