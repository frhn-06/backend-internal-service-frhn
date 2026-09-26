import dotenv from 'dotenv'

dotenv.config();


export const PORT = process.env.PORT || "";
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const JWT_SECRET = process.env.JWT_SECRET || "";
export const OPENAI_API_KEY= process.env.OPENAI_API_KEY || "";

export const CLIENT_URL = process.env.CLIENT_URL || "";