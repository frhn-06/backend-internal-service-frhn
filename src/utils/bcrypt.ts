import bcrypt from 'bcrypt'

const saltRonde = 10;

export const hashPassword = async (password: string) :Promise<string> => {
    return await bcrypt.hash(password, saltRonde);
}


export const comparePassword = async (password: string, passwordHashed: string) :Promise<boolean> => {
    return await bcrypt.compare(password, passwordHashed);
}