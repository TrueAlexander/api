import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import { createNewPost, getAllPosts, getOnePost, updateThePost, deleteThePost } from "./controllers/PostController.js"
import { registerNewUser, login } from "./controllers/UserController.js"
import checkAuth from "./utils/checkAuth.js"
import checkRights from "./utils/checkRights.js"
import { registerUserValidation, loginUserValidation, postValidation } from "./utils/validations.js" 
import handleValidationErrors from "./utils/handleValidationErrors.js"
dotenv.config()

const PORT = process.env.PORT
const app = express()

mongoose.connect(process.env.MONGO_DB_KEY)
.then(() => console.log("DB is OK"))
.catch((err) => console.log("DB error!"))

//middlewares
app.use(cors())
app.use(express.json())

///authorization:
//1. POST Register a new user
app.post("/auth/register", registerUserValidation, handleValidationErrors, registerNewUser)
//2. POST Login
app.post("/auth/login", loginUserValidation, handleValidationErrors, login)

///CRUD of Posts
// 1. GET all posts
app.get("/posts", getAllPosts)

// 2. POST a new post// !!!!!!!!!!!!!!!!!ADD LOGIN
app.post("/posts", checkAuth, postValidation, handleValidationErrors, createNewPost)

// 3. GET the post by ID
app.get("/posts/:id", getOnePost)

// 4. PUT update the post by ID// !!!!!!!!!!!!!!!!!ADD LOGIN and check if Author or Admin
app.put("/posts/:id", checkAuth, checkRights, postValidation, handleValidationErrors, updateThePost)

// 5. DELETE the post by ID/ !!!!!!!!!!!!!!!!!ADD LOGIN and check if Author or Admin
app.delete("/posts/:id", checkAuth, checkRights, deleteThePost)

app.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log("Server is OK. Port #" + PORT)
})

