import * as z from 'zod';

export const multidimentionalNumberArraySchema = z.object({
    rolls: z.array(z.array(z.number()))
});

export type MultidimentionalNumberArray = z.infer<typeof multidimentionalNumberArraySchema>;