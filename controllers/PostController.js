import PostModel from "./../models/Post.js"

export const createNewPost = async (req, res) => {
  try {
    const post = new PostModel({
      title: req.body.title,
      text: req.body.text,
      author: req.userId,
    })
    const newPost = await post.save()
    res.json(newPost)

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not posted"
    })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
    res.json(posts)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not got posts"
    })
  }
}

export const getOnePost = async (req, res) => {
  try {
    const id = req.params.id
    const post = await PostModel.findById(id)
    res.json(post)
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not found the post"
    })
  }
}

export const updateThePost = async (req, res) => {
  try {
    const id = req.params.id
    await PostModel.findByIdAndUpdate(
      id,
      { $set: req.body }, 
      { new:true }
    )
    res.json({
      message: "The post was successfully updated"
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "The post not been updated"
    })
  }
}

export const deleteThePost = async (req, res) => {
  try {
    const id = req.params.id
    await PostModel.findByIdAndDelete(id)
    res.json({
      message: "The post was successfully deleted"
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "The post not been deleted"
    })
  }
}