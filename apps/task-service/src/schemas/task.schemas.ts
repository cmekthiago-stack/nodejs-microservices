import {z} from 'zod'


export const createTaskSchema = z.object({
    title: z.string().min(5, 'Title is required'),
})

export type createTaskInput = z.infer<typeof createTaskSchema>