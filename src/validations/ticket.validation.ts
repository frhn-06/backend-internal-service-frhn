import zod, {z} from 'zod'
import { PriorityTicket } from '../generated/prisma/enums.js'


const TicketDTO = zod.object({
    title: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1),
    priority: z.enum([PriorityTicket.LOW, PriorityTicket.MEDIUM, PriorityTicket.HIGH, PriorityTicket.URGENT]),
    departmentId: z.number().int(),
    categoryId: z.number().int(),  
})

export {TicketDTO}