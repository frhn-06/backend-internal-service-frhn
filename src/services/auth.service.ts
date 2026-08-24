import { z} from 'zod';
import { LoginDTO, RegisterDTO } from '../validations/user.validation';
import prisma from '../config/prisma'
import { hashPassword } from '../utils/bcrypt';
import { UserRole } from '../generated/prisma/enums';


const AuthService = {
    register: async (register: z.infer<typeof RegisterDTO>) => {
        try {
            const passwordHashed = await hashPassword(register.password)

            return await prisma.user.create({
                data: {
                    name: register.name,
                    email: register.email,
                    role: UserRole.EMPLOYEE,
                    departmentId: register.departmentId,
                    password: passwordHashed
                },
                omit: {
                    password: true
                }
            })
        } catch(error) {
            throw error
        }
    },


    findUserLogin: async (login: z.infer<typeof LoginDTO>) => {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    OR: [
                        {
                            name: login.identifier
                        },
                        {
                            email: login.identifier
                        }
                    ]
                }
            });

            return user;
        } catch(error) {
            throw error
        }
    }
}

export default AuthService