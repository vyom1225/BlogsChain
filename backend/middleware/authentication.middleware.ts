import { verify } from "hono/jwt";
import type {Context , Next} from 'hono';

export async function authentication (c : Context , next : Next){

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
}