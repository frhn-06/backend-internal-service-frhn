import { Response } from "express";
import { IreqUser } from "../types/user.js";
import response from "../utils/response.js";
import { AgentDTO } from "../validations/user.validation.js";
import AgentService from "../services/agent.service.js";
import { Prisma, UserRole } from "../generated/prisma/client.js";
import UserService from "../services/user.service.js";
import DepartmentService from "../services/department.service.js";

const agentController = {
    create: async(req:IreqUser, res:Response) => {
        try {
            const validate = AgentDTO.parse(req.body);

            const department = await DepartmentService.findById(validate.departmentId);

            if(!department) return response.notFound(res, "Department tidak ditemukan");
            
            const result = await AgentService.create(validate);

            response.success(res, result, "Success to create agent")
        }catch(error) {
            response.error(res, error, "Failed to create agent");
        }
    },

    findAll: async(req:IreqUser, res:Response) => {
        try {
            const {
                page = 1,
                limit = 8,
                depart,
                search
            } = req.query as {
                page: number | string;
                limit: number | string;
                depart: number | string;
                search: string;
            }

            const pageNumber = Number(page);
            const limitNumber = Number(limit);
            const departNumber = Number(depart);
            if(Number.isNaN(pageNumber) || Number.isNaN(limitNumber) || (depart && Number.isNaN(departNumber))) return response.notFound(res, "List agent tidak ditemukan")

            const setQuery = () : Prisma.UserWhereInput => {
                let query : Prisma.UserWhereInput = {
                    role: UserRole.AGENT,
                    isActive: true
                }

                if(depart) {
                    query.departmentId = departNumber;
                }

                if(search) {
                    query.name = {
                        contains: search,
                        mode: "insensitive"
                    }
                }

                return query;
            }

            const query = setQuery();

            const result = await UserService.findAll(query, pageNumber, limitNumber);

            const totalData = await UserService.countTotal(query);

            response.pagination(res, result, {
                total: totalData,
                totalPage: Math.ceil(totalData / limitNumber),
                currentPage: pageNumber
            }, "Success to find all of agent")
        }catch(error) {
            response.error(res, error, "Failed to find all of agent");
        }
    },

    findById: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Agent tidak ditemukan");

            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Agent tidak ditemukan");

            const query = {
                role: UserRole.AGENT
            }

            const result = await UserService.getUserById(idNumber, query);

            if(!result) return response.notFound(res, "Agent tidak ditemukan");

            response.success(res, result, "Success to find agent")
        }catch(error) {
            response.error(res, error, "Failed to find agent");
        }
    },

    update: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Agent tidak ditemukan");

            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Agent tidak ditemukan");
            
            const validate = AgentDTO.partial();
            const validateUpdate = validate.parse(req.body);
            const {password, ...finalValidate} = validateUpdate;

            const result = await AgentService.update(idNumber, finalValidate);

            response.success(res, result, "Success to update agent")
        }catch(error) {
            response.error(res, error, "Failed to update agen");
        }
    },

    delete: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Agent tidak ditemukan");

            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Agent tidak ditemukan");

            const result = await UserService.delete(idNumber);

            response.success(res, result, "Success to delete agent")
        }catch(error) {
            response.error(res, error, "Failed to delete agent");
        }
    },
}


export default agentController;