import z from "zod";
import { CategoryDTO } from "../validations/category.validation.js";
import prisma from "../config/prisma.js";
import { Category, Prisma } from "../generated/prisma/browser.js";

const CategoryService = {
    create: async (data: z.infer<typeof CategoryDTO>) => {
        try {
            return await prisma.category.create({
                data: {
                    name: data.name,
                    description: data.description,
                    departmentId: data.departmentId,
                }
            });
        } catch (error) {
            throw error;
        }
    },


    findAll: async (query: Prisma.CategoryWhereInput, page: number, limit: number) => {
        try {
            return await prisma.category.findMany({
                where: query,                
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    department: {
                        select: {
                            id: true,
                            name: true,
                        }
                    }
                },
            });
        } catch (error) {
            throw error;
        }
    },


    findOne: async (id: number) => {
        try {
            return await prisma.category.findUnique({
                where: {
                    id
                }
            })
        } catch(error) {
            throw error;
        }
    },

    update: async(id: number, data: Partial<z.infer<typeof CategoryDTO>>) => {
        try {
            return await prisma.category.update({
                where: {
                    id
                },
                data
            })
        }catch(error) {
            throw error
        }
    },


    updateStatus: async (id: number, isActive: boolean) => {
        try {
            return await prisma.category.update({
                where: {
                    id
                },
                data: {
                    isActive
                }
            });
        } catch(error) {
            throw error
        }
    },


    delete: async (id: number) => {
        try {
            return await prisma.category.delete({
                where: {
                    id
                }
            });
        } catch(error) {
            throw error
        }
    },


    countTotal: async (query: Prisma.CategoryWhereInput) => {
        try {
            return await prisma.category.count({
                where: query
            })
        } catch(error) {
            throw error
        }
    }
}

export default CategoryService;