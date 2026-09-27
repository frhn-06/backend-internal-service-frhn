import { Response } from "express";
import { IreqUser, IReqUserPlusTicket } from "../types/user.js";
import response from "../utils/response.js";
import NotificationService from "../services/notification.service.js";
import TicketService from "../services/ticket.service.js";

const notificationController = {
    findAll: async(req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const result = await NotificationService.findAll(userId);

            response.success(res, result, "Success to get notifications");
        } catch(error) {
            response.error(res, error, "Failed to get notifications");
        }
    },




    countAll: async(req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const result = await NotificationService.countAll(userId);

            response.success(res, result, "Success to get count notifications")
        } catch(error) {
            response.error(res, error, "Failed to get count notifications"); 
        }
    },


    countMessage: async(req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const result = await NotificationService.countMessage(userId);

            response.success(res, result, "success to get count message notifications")
        } catch(error) {
            response.error(res, error, "Failed to get count message notifications")
        }
    },


    countMessageByTicket: async (req:IreqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const result = await NotificationService.countMessageByTicket(userId);

            
            response.success(res, result, "success to get count message notifications by ticket")
        } catch(error) {
            response.error(res, error, "Failed to get count message notifications by ticket")
        }
    },






    readNotificationById: async(req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const {id} = req.params;
            if(!id) return response.notFound(res, "Notification tidak ditemukan");
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Notification tidak ditemukan");


            const result = await NotificationService.readNotificationById({
                id: idNumber,
                targetId: userId
            })
            if(!result)  return response.notFound(res, "Notification tidak ditemukan");
            
            response.success(res, result, "Success to read notification by id") 
        } catch(error) {
            response.error(res, error, "Failed to read notification by id")
        }
    },



    readNotificationMessage: async(req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");
            
            const {ticketId} = req.params;
            if(!ticketId) return response.notFound(res, "Ticket tidak ditemukan");
            const ticketIdNumber = Number(ticketId);
            if(Number.isNaN(ticketIdNumber)) return response.notFound(res, "Ticket tidak ditemukan");

            const result = await NotificationService.readMessageNotification({
                ticketId:ticketIdNumber,
                targetId: userId
            });

            response.success(res, result, "Success to read message notifications") 
            
        } catch(error) {
            response.error(res, error, "Failed to read message notifications")
        }
    },



    markAll: async(req:IreqUser, res: Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const result = await NotificationService.markAll(userId);

            return response.success(res, result, "Success to mark all notifications")
        } catch(error) {
            response.error(res, error, "Failed to mark all notifications")
        }
    },



    removeById: async(req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const {id} = req.params;
            if (!id) return response.notFound(res, "Notification tidak ditemukan");

            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Notification tidak ditemukan");

            const result = await NotificationService.removeById({
                userId,
                id: idNumber
            });

            return response.success(res, result, "Success to remove a notification")
        } catch(error) {
            response.error(res, error, "Failed to remove a notification")
        }
    },


    removeMany: async(req:IreqUser, res:Response) => {
        try {
            const userId = req.user?.id;
            if(!userId) return response.notFound(res, "User tidak ditemukan");

            const result = await NotificationService.removeMany(userId);

            return response.success(res, result, "Success to remove all notifications")
        } catch(error) {
            response.error(res, error, "Failed to remove all notifications")
        }
    },



    
}


export default notificationController;