import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify,decode} from 'hono/jwt'
import { authentication } from '../middleware/authentication.middleware'


export const blogRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string
    },
    Variables : {
        userID : string,
    }
}>()

//Middleware for user authentication
blogRouter.use(authentication);

blogRouter.post("/" , (c) => {
    return c.text("Successfully uploaded the blogs")
})
blogRouter.put("/" , (c) => {
    return c.text("Successfully updated blogs data")
})
blogRouter.get("/:id" , (c) => {
    return c.text("Sucessfully fetched blogs")
})
blogRouter.get("/bulk" , (c) => {
    return c.text("Sucessfully fetched blogs")
})