import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.js"

const app = express();
app.use(express.urlencoded({extended: true}))
app.use(cors())
app.use(cookieParser())

app.use("/api/v1",routes)

app.use("/",(req,res) =>{
    res.send("hello there ")
})

app.all("*",(_req,res)=>{
    return res.status(404).json({
        success: false,
        message: "Routes not found"
    })
})


export default app ;