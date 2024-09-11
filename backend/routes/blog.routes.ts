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

blogRouter.post("/" , async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const body = await c.req.json();

    const blog = await prisma.blog.create({
        data : {
            title : body.title,
            content : body.content,
            authorID : c.get("userID")
        }
    })

    if(!blog){
        c.status(403)
        return c.text("There was an error connecting to the database")
    }

    return c.json({
        blogID : blog.id
    })

})

blogRouter.put("/" ,async (c) => {

    const body = await c.req.json();
    const ispublished = body.published === "True"

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());

    let blog;

    try{
         blog = await prisma.blog.update({
            where : {
                id : body.blogID,
            },
            data : {
                title : body.title,
                content : body.content,
                published : ispublished
            }
        })
    }catch(e){
        c.status(403);
        return c.json({ msg : "There was no such BLOG"});
    }
   
    return c.json(blog)

})

blogRouter.get("/bulk" , async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const blogs = await prisma.blog.findMany({
        where : {
            authorID : c.get("userID")
        }
    })

    return c.json({
        blogs
    })
    
})

blogRouter.get("/:id" , async (c) => {

    const blogID = c.req.param("id");

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate())

    let blog;

    try{
        blog = await prisma.blog.findUnique({
            where : {
                id : blogID
            }
        })
    }catch(e){
        c.status(403)
        return c.json({
            msg : "NO such Blog was found"
        })
    }
    
    if(blog?.published || c.get("userID") == blog?.authorID){
        return c.json({
            blog
        })
    }

    c.status(403)
    return c.json({
        msg : "The Blog is not availble right now"
    })

})

