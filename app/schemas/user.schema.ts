import { z } from "zod";
export const userSchema=z.object({
    name:z.string().min(3, "Name must be at least 3 characters"),
    email:z.string().email("Invalid email address"),
    password:z.string().min(6, "Passwors must be at least 6 characters"),
    age:z.number().min(18, "Age must be 18 or above"),
})

export type userType=z.infer<typeof userSchema>