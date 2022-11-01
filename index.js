import express from "express"
import cors from 'cors'
import mongoose from 'mongoose'
import { createNewPost, getAllPosts, getOnePost, updateThePost, deleteThePost } from "./controllers/PostController.js"
import { registerNewUser, login } from "./controllers/UserController.js"
import checkAuth from "./utils/checkAuth.js"
import checkRights from "./utils/checkRights.js"

const PORT = 4444
const app = express()

mongoose.connect("mongodb+srv://TrueAlexander:Parol1001@cluster0.ncyqfbn.mongodb.net/blog-eformaliza?retryWrites=true&w=majority")
.then(() => console.log("DB is OK"))
.catch((err) => console.log("DB error!"))

//middlewares
app.use(cors())
app.use(express.json())

///authorization:
//1. POST Register a new user
app.post("/auth/register", registerNewUser)
//2. POST Login
app.post("/auth/login", login)

///CRUD of Posts
// 1. GET all posts
app.get("/posts", getAllPosts)

// 2. POST a new post// !!!!!!!!!!!!!!!!!ADD LOGIN
app.post("/posts", checkAuth, createNewPost)

// 3. GET the post by ID
app.get("/posts/:id", getOnePost)

// 4. PUT update the post by ID// !!!!!!!!!!!!!!!!!ADD LOGIN and check if Author or Admin
app.put("/posts/:id", checkAuth, checkRights, updateThePost)

// 5. DELETE the post by ID/ !!!!!!!!!!!!!!!!!ADD LOGIN and check if Author or Admin
app.delete("/posts/:id", checkAuth, checkRights, deleteThePost)

app.listen(PORT, (err) => {
  if (err) console.log(err)
  console.log("Server is OK. Port #" + PORT)
})

