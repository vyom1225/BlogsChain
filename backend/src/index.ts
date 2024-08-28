import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {sign,verify,decode} from 'hono/jwt'

const app = new Hono<{
    Bindings:{
        DATABASE_URL : string,
        JWT_SECRET : string,
    }
}>();

//Middleware for protected routes
app.use("/api/v1/blogs/*" , async (c,next) => {

    let token = c.req.header("authorization");
    
    if(!token){
        c.status(403);
        return c.json({error : "You are not Authorized"});
    }

    token = token.split(" ")[1];

    const payload = await verify(token , c.env.JWT_SECRET)

    if(!payload){
        c.status(403);
        return c.json({error : "You are not Authorized"});
    }

    await next()
})
app.post("/api/v1/signup" , async (c) => {

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

    const payload = {
        ID : user.id,
        exp : Math.floor(Date.now()/(1000*60)) + 1440, 
    }

    const secret = c.env.JWT_SECRET;

    const token = await sign(payload , secret)

    return c.json({
        jwt : token,
    })
});

app.post("api/v1/signin" , async (c) => {

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

    const token = await sign({id : user.id} , c.env.JWT_SECRET);

    return c.json({
        jwt : token
    })
});


app.post("api/v1/blogs" , (c) => {
    return c.text("Successfully uploaded the blogs")
})
app.put("api/v1/blogs" , (c) => {
    return c.text("Successfully updated blogs data")
})
app.get("api/v1/blogs/:id" , (c) => {
    return c.text("Sucessfully fetched blogs")
})
app.get("api/v1/blogs/bulk" , (c) => {
    return c.text("Sucessfully fetched blogs")
})


export default app
