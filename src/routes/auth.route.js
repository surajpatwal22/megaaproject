import { Router } from "express";

const route = Router()

route.post("/signup",signUp)
route.post("/login",login)
route.get("/logout",logout)


route.get("/profile", isLoggedIn ,getProfile)




export default router;