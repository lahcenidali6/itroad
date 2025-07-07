import express from "express"
import { userInfo ,userUpdateController ,userRegisterController,userDocumentsController,deleteDocumentController, addDocumentController,userUpdateAvatarController } from "../controllers/userController.js"
import { auth } from "../middleware/auth.js"
const userRoute=express.Router()

userRoute.get("/me",auth,userInfo)
userRoute.post("/register",userRegisterController)
userRoute.put("/update",auth,userUpdateController)
userRoute.patch("/update/avatar",auth,userUpdateAvatarController)


userRoute.get("/documents",auth,userDocumentsController)
userRoute.delete("/documents/:documentId",auth,deleteDocumentController)
userRoute.post("/documents",auth,addDocumentController)




export default userRoute