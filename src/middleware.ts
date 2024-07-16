import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtected = createRouteMatcher([
  '/dashboard(.*)'
])
export default clerkMiddleware((auth,req)=>{
  if(isProtected(req)) auth().protect()
});

