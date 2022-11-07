import express from "express"
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import mongoose from 'mongoose'
import multer from 'multer'
import { createNewPost, getAllPosts, getOnePost, updateThePost, deleteThePost } from "./controllers/PostController.js"
import { registerNewUser, login, emailVerify, accessRecovery, resetPassword, confirmPassword } from "./controllers/UserController.js"
import checkAuth from "./utils/checkAuth.js"
import checkRights from "./utils/checkRights.js"
import { registerUserValidation, loginUserValidation, postValidation, emailValidation, passwordConfirmValidation } from "./utils/validations.js" 
import handleValidationErrors from "./utils/handleValidationErrors.js"
dotenv.config()

const PORT = process.env.PORT
const app = express()

mongoose.connect(process.env.MONGO_DB_KEY)
.then(() => console.log("DB is OK"))
.catch((err) => console.log("DB error!"))

//create a storage for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })


//middlewares
app.use(cors())
app.use(express.json())
//to have access to uploaded images(static files), otherwise express will look for the mentioned absent route
app.use("/uploads", express.static("uploads"))

///authorization:
//1. POST Register a new user
app.post("/auth/register", registerUserValidation, handleValidationErrors, registerNewUser)

//2. GET verify the email of the user
app.get("/auth/verify", emailVerify)

//3. POST Login
app.post("/auth/login", loginUserValidation, handleValidationErrors, login)

//4. POST recuperate access
app.post("/auth/access-recovery", emailValidation, handleValidationErrors, accessRecovery)

//5. get reset password
app.get("/auth/reset-password", resetPassword)

//6. POST confirm new password
app.post("/auth/confirm", passwordConfirmValidation, handleValidationErrors, confirmPassword)

// passwordValidation, handleValidationErrors,

///CRUD of Posts
// 1. GET all posts
app.get("/posts", getAllPosts)

// 2. POST a new post// LOGIN
app.post("/posts", checkAuth, postValidation, handleValidationErrors, createNewPost)

// 3. GET the post by ID
app.get("/posts/:id", getOnePost)

// 4. PUT update the post by ID//  LOGIN and check if Author or Admin
app.put("/posts/:id", checkAuth, checkRights, postValidation, handleValidationErrors, updateThePost)

// 5. DELETE the post by ID/  LOGIN and check if Author or Admin
app.delete("/posts/:id", checkAuth, checkRights, deleteThePost)

// 6 upload images
app.post("/upload", checkAuth, upload.single('image'), (req, res) => {
  res.status(200).json({
    // url: `/uploads/${req.file.originalname}`,
    message: "The image was successfully uploaded!"
  })
})

app.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log("Server is OK. Port #" + PORT)
})

