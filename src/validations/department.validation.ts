import zod, { z } from 'zod';


const DepartmentDTO = zod.object({
    name: z.string().trim().min(1).max(100)
});


export {DepartmentDTO}