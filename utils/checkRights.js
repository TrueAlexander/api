import PostModel from "./../models/Post.js"

 const checkRights = async (req, res, next) => {
  try {
    //find the post by the post id 
    const post = await PostModel.findById(req.params.id)
    //id of the author of the post
    const authorId = post.author.toString() 
    //id of the current user
    const userId = req.userId
    //isAdmin
    console.log(req.isAdmin)

    if (userId === authorId || req.isAdmin) {
      next()
    } else return res.status(403).json({
      message: "You are not authorized for this!"
    }) 
  } catch (err) {
    return res.status(404).json({
      message: "The post was not found"
    }) 
  }  
}

export default checkRights