import {z} from 'zod';
import { AgentDTO } from '../validations/user.validation.js';
import prisma from '../config/prisma.js';
import { UserRole } from '../generated/prisma/enums.js';
import { Prisma } from '../generated/prisma/client.js';


const AgentService = {
    create: async(data: z.infer<typeof AgentDTO>) => {
        try {
            return await prisma.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    departmentId: data.departmentId,
                    password: data.password,
                    role: UserRole.AGENT
                }
            })
        }catch(error) {
            throw error
        }
    },


    update: async (id: number, data: Partial<z.Infer<typeof AgentDTO>>) => {
        try {
            return await prisma.user.update({
                where: {
                    id
                },
                data: data
            });
        } catch(error) {
            throw error
        }
    }

}

export default AgentService;