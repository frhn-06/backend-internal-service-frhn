import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './env.js';


interface IUserLogin {
    id: number;
    role: string;
    departmentId: number | null,
        
}

export const signIn = async (user: IUserLogin) :Promise<string> => {
    return await jwt.sign(user, JWT_SECRET, {
        expiresIn: "1h"
    })
}