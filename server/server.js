import express from "express"
import authRouter from "./routes/authRoute.js"
import userRoute from "./routes/userRoute.js"
import cors from "cors"
const app = express()
app.use(cors({
  origin: 'http://localhost:5173',              
}));


app.use("/api", authRouter);
app.use("/api/users",userRoute)


app.get("/",(req,res)=>{
    res.send("home page")
})



app.listen(5000,()=>{
    console.log("server is running!")
})