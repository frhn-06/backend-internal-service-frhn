import { Response } from "express";
import {  IreqUser } from "../types/user.js";
import { CategoryDTO } from "../validations/category.validation.js";
import CategoryService from "../services/category.service.js";
import DepartmentService from "../services/department.service.js";
import { Prisma } from "../generated/prisma/browser.js";
import response from "../utils/response.js";

const categoryController = {
    create: async (req: IreqUser, res:Response) => {
        try {
            const validate = CategoryDTO.parse(req.body);

            const department = await DepartmentService.findById(validate.departmentId);
            if(!department) return response.notFound(res, "Department tidak ditemukan");

            const category = await CategoryService.create(validate);

            return response.success(res, category, "Category created successfully");
        } catch (error) {
            return response.error(res, error, "Failed to create category");
        }
    },


    findAll: async (req: IreqUser, res:Response) => {
        try {
            const {
                page = 1,
                limit = 8,
                active,
                search
            } = req.query as {
                page: number | string;
                limit: number | string;
                active: string;
                search: string
            }

            const numberPage = Number(page);
            const numberLimit = Number(limit);
            if(Number.isNaN(page) || Number.isNaN(limit)) return response.notFound(res, "List Kategori tidak ditemukan");

            const setQuery = () : Prisma.CategoryWhereInput => {
                let query: Prisma.CategoryWhereInput = {}

                if(search) {
                    query.name = {
                        contains: search,
                        mode: "insensitive"
                    }
                }

                if(active === "true") {
                    query.isActive = true;
                }

                if(active === "false") {
                    query.isActive = false
                }

                return query;
            }

            const query = setQuery();
            
            const result = await CategoryService.findAll(query, numberPage, numberLimit);

            const totalData = await CategoryService.countTotal(query)
            
            response.pagination(res, result, {
                total: totalData,
                totalPage: Math.ceil(totalData / numberLimit),
                currentPage: numberPage
            }, "Success to find all categories");

        } catch (error) {
            return response.error(res, error, "Failed to find all categories");
        }
    },


    findByDepartment: async(req:IreqUser, res: Response) => {
        try{
            const {id} = req.params;
            const idNumber = Number(id);
            if(!id || Number.isNaN(idNumber)) return response.notFound(res, "Category tidak ditemukan")

            const query : Prisma.CategoryWhereInput= {
                departmentId: idNumber,
                isActive: true
            }

            const result = await CategoryService.findAll(query, 1, 100);

            response.success(res, result, "Success to find categories by department")
        }catch(error) {
            return response.error(res, error, "Failed to find categories by department");
        }
    },


    findById: async (req:IreqUser, res: Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Category tidak ditemukan");
            
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Category tidak ditemukan");

            const result = await CategoryService.findOne(idNumber);

            if(!result) return response.notFound(res, "Category tidak ditemukan");

            response.success(res, result, "Success to find category");
        } catch (error) {
            response.error(res, error, "Failed to find category");
        }
    },


    update: async(req:IreqUser, res:Response) =>{
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Category tidak ditemukan");
            
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Category tidak ditemukan");

            const validate = CategoryDTO.partial();
            const validateUpdate = validate.parse(req.body);

            if(validateUpdate.departmentId) {
                const department = await DepartmentService.findById(validateUpdate.departmentId);
                if(!department) return response.notFound(res, "Department tidak ditemukan");
            }

            const result = await CategoryService.update(idNumber, validateUpdate);

            response.success(res, result, "Success to update category");
            
        } catch(error) {
            response.error(res, error, "Failed to update category");
        }
    },



    status: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Category tidak ditemukan");
            
            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Category tidak ditemukan");

            const category = await CategoryService.findOne(idNumber);
            if(!category) return response.notFound(res, "Category tidak ditemukan");

            const result = await CategoryService.updateStatus(idNumber, !category.isActive);

            response.success(res, result, "Success to change status category")
        } catch(error) {
            response.error(res, error, "Failed to change status category");
        }
    },


    delete: async(req:IreqUser, res:Response) => {
        try {
            const {id} = req.params;
            if(!id) return response.notFound(res, "Category tidak ditemukan");

            const idNumber = Number(id);
            if(Number.isNaN(idNumber)) return response.notFound(res, "Category tidak ditemukan");

            const result = await CategoryService.delete(idNumber);

            response.success(res, result, "Success to delete category")
        }catch(error) {
            response.error(res, error, "Failed to delete category");
        }
    },
}


export default categoryController;