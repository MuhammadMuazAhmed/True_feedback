import z from "zod";


export const verifySchema = z.object({
    code: z
        .number()
        .min(6, { message: "Code must be at least 6 characters long" })
        .max(6, { message: "Code must be at most 6 characters long" })
})