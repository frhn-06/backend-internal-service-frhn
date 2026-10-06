import { Response } from "express"
import { IreqUser } from "../types/user.js"
import response from "../utils/response.js"
import { PasswordDTO, UserDTO } from "../validations/user.validation.js"
import UserService from "../services/user.service.js"

const userController = {
    update: async (req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const validateProfile = UserDTO.partial()
            const validateProfileUpdate = validateProfile.parse(req.body);

            const result = await UserService.update({
                userId,
                data: validateProfileUpdate
            })
            if(!result) return response.error(res, false, "Failed to update profile");

            response.success(res, result, "Success to update profile");

        } catch(error) {
            response.error(res, error, "Failed to update profile");
        }
    },


    updatePassword: async(req:IreqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const validatePassword = PasswordDTO.parse(req.body)

            const result = await UserService.updatePassword({
                userId,
                password: validatePassword.password
            })
            if(!result) return response.error(res, false, "Failed to update password");

            response.success(res, result, "Success to update password");
            
        } catch(error) {
            response.error(res, error, "Failed to update password");
        }
    }
}


export default userController;