import zod, {z} from 'zod'

const MessageDTO = zod.object({
    content: z.string().min(1).trim()
})

export {MessageDTO}