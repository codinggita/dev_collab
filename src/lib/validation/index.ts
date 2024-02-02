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
    projectTitle: z.string().min(8, {message: 'Title must be at least 8 characters'}),
    projectContent: z.string().min(20, {message: 'Content must be at least 20 characters'}).max(2250),
    file: z.custom<File[]>(),
    scope: z.string().min(8).max(20),
})