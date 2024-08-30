import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify,decode} from 'hono/jwt'


export const userRouter = new Hono<{
    Bindings : {
        DATABASE_URL : string,
        JWT_SECRET : string,
    },
    Variables : {
        userID : string,
    }
}>

userRouter.post("/signup" , async (c) => {

    const prisma = new PrismaClient({datasourceUrl: c.env.DATABASE_URL})
    .$extends(withAccelerate())

    const body = await c.req.json()

    const user = await prisma.user.create({
        data : {
            user_name : body.username,
            email : body.email,
            password : body.password,
        }
    })

    const token = await sign({userID : user.id} , c.env.JWT_SECRET);

    return c.json({
        jwt : token,
    })
});

userRouter.post("/signin" , async (c) => {

    const prisma = new PrismaClient({
        datasourceUrl : c.env.DATABASE_URL
    }).$extends(withAccelerate());

    const body = await c.req.json();

    const user = await prisma.user.findUnique({
        where : {
            email : body.email
        }
    })

    if(!user){
        c.status(403);
        return c.text("NO such user exists");
    }

    if(body.password != user.password){
        return c.text("Wrong Password");
    }

    const token = await sign({userID : user.id}, c.env.JWT_SECRET);

    return c.json({
        jwt : token
    })
});