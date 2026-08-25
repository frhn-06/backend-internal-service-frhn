import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './env.js';


interface IUserToken {
    id: number;
    role: string;
    departmentId: number | null;       
}

export const signIn = async (user: IUserToken) :Promise<string> => {
    return await jwt.sign(user, JWT_SECRET, {
        expiresIn: "1h"
    })
}


export const getUserByToken = async (token: string) => {
    return await jwt.verify(token, JWT_SECRET) as IUserToken;
}

export type {IUserToken}