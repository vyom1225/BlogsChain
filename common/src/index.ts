import z from "zod";

export const signupInput = z.object({
    username : z.string(),
    password : z.string().min(6),
    email : z.string().email()
})

export const signinInput = z.object({
    email : z.string().email(),
    password : z.string().min(6)
})

export const createBlogInput = z.object({
    title : z.string(),
    content : z.string()
})

export const updateBlogInput = z.object({
    title : z.string(),
    content : z.string(),
    published : z.boolean()
})

export type SignupInput = z.infer<typeof signupInput>
export type SigninInput = z.infer<typeof signinInput>
export type CreateBlogInput = z.infer<typeof createBlogInput>
export type UpdateBlogInput = z.infer<typeof updateBlogInput>