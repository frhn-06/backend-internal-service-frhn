import { Request, Response } from "express";
import response from "../utils/response.js";
import { LoginDTO, RegisterDTO } from "../validations/user.validation.js";
import AuthService from "../services/auth.service.js";
import { comparePassword } from "../utils/bcrypt.js";
import { signIn } from "../utils/jwt.js";


const authController = {
    register: async (req:Request, res:Response) => {
        try {
            const validate = RegisterDTO.parse(req.body);

            const result = await AuthService.register(validate);

            response.success(res, result, "Success Register")
            
        } catch (error) {
            response.error(res, error, "Failed Register");
        }
    },


    login: async (req:Request, res:Response) => {
        try {
            const validate = LoginDTO.parse(req.body);

            const user = await AuthService.findUserLogin(validate);
            if(!user) return response.notFound(res, "User tidak ditemukan");
        
            const passwordSame = await comparePassword(validate.password, user.password);
            if(!passwordSame) return response.error(res, false, "Password tidak sesuai");

            const token = await signIn({
                id: user.id,
                role: user.role,
                departmentId: user.departmentId
            });


            response.success(res, token, "Success Login")
        } catch(error) {
            response.error(res, error, "Failed Login")
        }
    }
}


export default authController