import express from "express"
import { login} from "../controllers/authController.js"
const authRouter=express.Router()


authRouter.use(express.json())
authRouter.post("/auth/login",login)






export default authRouter