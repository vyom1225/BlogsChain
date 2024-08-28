import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import * as dotenv from 'dotenv'

const prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
}).$extends(withAccelerate())

const app = new Hono()

app.post("/api/v1/signup" , (c) => {
  return c.text("you have signed up")
});
app.post("api/v1/signin" , (c) => {
    return c.text("you are now signed in")
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
