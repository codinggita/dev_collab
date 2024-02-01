import * as z from "zod";

//Basically it is the schema or the structure of the sign-up form
export const SignupValidation = z.object({
    name: z.string().min(2, {message: 'Too short'}),
    username: z.string().min(2, {message: 'Too short'}),
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be at least 8 characters'}),
})

//Basically it is the schema or the structure of the sign-in form
export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message: 'Password must be at least 8 characters'}),
})

//Basically it is the schema or the structure of the sign-in form
export const FormValidation = z.object({
    projectTitle: z.string().email(),
    projectContent: z.string().min(10).max(2250),
    file: z.custom<File[]>(),
})