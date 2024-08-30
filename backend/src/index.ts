import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import * as dotenv from 'dotenv'

<<<<<<< HEAD
const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())
=======
const app = new Hono<{
    Bindings:{
        DATABASE_URL : string,
        JWT_SECRET : string,
    },
    Variables : {
        userID : string,
    }
}>();
>>>>>>> f92b380 (fixed type error)

const app = new Hono()

<<<<<<< HEAD
app.post("/api/v1/signup" , (c) => {
  return c.text("you have signed up")
});
app.post("api/v1/signin" , (c) => {
    return c.text("you are now signed in")
=======
    let token = c.req.header("authorization");
    
    if(!token){
        c.status(403);
        return c.json({error : "You are not Authorized"});
    }

    token = token.split(" ")[1];

    const payload= await verify(token , c.env.JWT_SECRET)
   
    if(!payload){
        c.status(403);
        return c.json({error : "You are not Authorized"});
    }
    
    c.set("userID" , payload.userID as string)

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

    const token = await sign({userID : user.id} , c.env.JWT_SECRET);

    return c.json({
        jwt : token,
    })
});

app.get("/" , (c) => {
    return c.text("what is this")
})

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

    const token = await sign({userID : user.id}, c.env.JWT_SECRET);

    return c.json({
        jwt : token
    })
>>>>>>> f92b380 (fixed type error)
});
app.post("api/v1/blogs" , (c) => {
    return c.text("Successfully uploaded the blogs")
})
app.put("api/v1/blogs" , (c) => {
    return c.text("Successfully updated blogs data")
})
app.get("api/v1/blogs/:id" , (c) => {
    const blogID = c.req.param().id
    console.log(blogID)
    console.log(c.get("userID"));
    return c.text("Sucessfully fetched blogs")
})
app.get("api/v1/blogs/bulk" , (c) => {
    return c.text("Sucessfully fetched blogs")
})


export default app
