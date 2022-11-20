import UserModel from "./../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()


//mail sender details
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'eformaliza@gmail.com',
    pass: process.env.PASSWORD
  }
})

export const registerNewUser = async (req, res) => {
  try {
    const candidateEmail = await UserModel.findOne({email: req.body.email})
    const candidateUsername = await UserModel.findOne({username: req.body.username})
    if (candidateEmail || candidateUsername) {
      res.status(409).json({
        message: "The user is already exists"
      })
    } else {
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
      ///
      const mailOptions = {
        from: ' "Verify your email" <eformaliza@gmail.com>',
        to: req.body.email,
        subject: 'eFormaliza blog. Verify your email!',
        html: `
        <h2>${req.body.username}! Thanks for registering on eFormaliza blog!</h2>
        <h4>Please verify your email to continue...</h4>
        <a href="http://${req.headers.host}/auth/verify?email=${req.body.email}">Click to verify here!</a>`
      }
   
      //sending email 
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error)
        } else {
          console.log('Verification email is sent to your gmail account')
          res.status(201).json({
            message: "The new user was created! Please verify your email!"
          })
        }
      })
    }   
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not registered"
    })
  }
}

export const emailVerify = async (req, res) => {
  try {
    console.log(req.query.email)
    const user = await UserModel.findOneAndUpdate(
      {email: req.query.email}, {emailVerified: true}, { new:true }
    )
    res.status(201).json({
      message: `Dear ${user.username}, your email ${req.query.email} was successfully verified! You are welcome to our blog!`
    })  
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not verified"
    })
  }
}


export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email
    })
    // not found user with received email
    if (!user) {
      return res.status(404).json({
        message: 'The User did not found',
      })
    } 
    //if user with received email exists check passwords
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    //if password is wrong
    if (!isPasswordCorrect) return res.status(401).json({
      message: "Wrong password or email"
    })
    ///
    if (!user.emailVerified) return res.status(401).json({
      message: `Your email is not verified. Please go to ${req.body.email} and confirm it.`
    })
    ////
    const token = jwt.sign({
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin
      },
    'secret',
     {expiresIn: 60 * 60})
    
     //to hide password and isAdmin on client side
     const {password, isAdmin, ...userData} = user._doc
   
    res
    // .cookie("access_token", token, {
    //   httpOnly: true,
    // })
    .json({
      userData,
      token,
      message: `Nice to see you ${user.username} again!` 
    })
   
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not logged in"
    })
  }
}

export const accessRecovery = async (req, res) => {
  try {
    const user = await UserModel.findOne({
      email: req.body.email
    })
    if (user) {
      ///send an email with instructions
      const mailOptions = {
        from: ' "Access recovery" <eformaliza@gmail.com>',
        to: req.body.email,
        subject: 'eFormaliza blog. Access recovery',
        html: `
        <h4>${user.username}! To access recover to eFormaliza blog please click on the link below...</h4>
        <a href="http://${req.headers.host}/auth/reset-password?email=${req.body.email}&user=${user._id.toString()}">Click to reset the password!</a>`
      }
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error)
        } else {
          res.status(200).json({
            message: `Dear ${user.username} to recover your access to eFormaliza blog please enter your email address!`
          })
        }
      })
      ////
    } else res.status(404).json({
      message: `The user with ${req.body.email} is not registered yet. Please create your profile on our platform!`
    })

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not accessed to server"
    })
  }
}

export const resetPassword = async (req, res) => {
  try {
    const user = await UserModel.findById(req.query.user)
    if (!user) {
      res.status(404).json({
        message: "The user not found"
      })
    } else {
      res.status(200).json({
        message: "Please digit the new password (Min length should be 5 symbols) and click Confirm new password."
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not accessed to server"
    })
  }
}

export const confirmPassword = async (req, res) => {
  try {
    const pass1 = req.body.password1
    const pass2 = req.body.password2
    const email = req.body.email

    if (pass1 !== pass2) {
      res.status(400).json({
        message: "Entered passwords don't match. Try one more time."
      })
    } else {
      //hash new password
      const password = pass1
      const salt = await bcrypt.genSalt(10)
      const newHash = await bcrypt.hash(password, salt)
      const user = await UserModel.findOneAndUpdate(
        {email: email},
        {password: newHash}, 
        { new:true })

      res.status(201).json({
        message: `Dear ${user.username}, your password was changed successfully. Please log in!`
      })
    }

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: "not accessed to server"
    })
  }
}