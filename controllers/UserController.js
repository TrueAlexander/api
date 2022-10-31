import UserModel from "./../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const registerNewUser = async (req, res) => {
  try {

    //hash the password
    const password = req.body.password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = new UserModel({
      username: req.body.username,
      email: req.body.email,
      password: hash,
      isAdmin: req.body.isAdmin
    })

    const newUser = await user.save()
    
    res.json({
      message: "The new user was created!"
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not registered"
    })
  }
}

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      username: req.body.username
    })

    if (!user) {
      return res.status(404).json({
        message: 'User did not found',
      })
    } 
    
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordCorrect) return res.status(400).json({
      message: "Wrong password or username"
    })

    const token = jwt.sign({
      _id: user._id,
      isAdmin: user.isAdmin
      },
    'secret')
    
     //to hide password and isAdmin on client side
     const {password, isAdmin, ...userData} = user._doc
   
    res.cookie("access_token", token, {
      httpOnly: true,
    }).json({
      userData,
      message: "Nice to see you again!" 
    })
   
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not logged in"
    })
  }
}





 