import {z} from 'zod'


export const createTaskSchema = z.object({
    title: z.string().min(5, 'Title is required'),
})

export const patchTaskSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters long').optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']).optional(),
}).refine((input) => input.title !== undefined || input.status !== undefined, {
    message: 'At least one field must be provided',
})

export type createTaskInput = z.infer<typeof createTaskSchema>;
export type patchTaskInput = z.infer<typeof patchTaskSchema>;