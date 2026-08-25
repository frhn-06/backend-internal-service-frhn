import prisma from "../config/prisma.js"

const UserService = {
    getUserById: async(id: number) => {
        try {
            return await prisma.user.findUnique({
                where: {
                    id: id
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