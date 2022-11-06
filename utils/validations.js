import { body } from 'express-validator'

export const registerUserValidation = [
  body('username', 'Add your name. Min length should be 3 symbols').isLength({min: 3}),
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password min length should be 5 symbols').isLength({min: 5}),
]

export const loginUserValidation = [
  body('email', 'Wrong email format').isEmail(),
  body('password', 'Password min length should be 5 symbols').isLength({min: 5}),
]

export const postValidation = [
  body('title', 'Add a title. Min length should be 5 symbols').isLength({min: 5}).isString(),
  body('text', 'Add a text. Min length should be 15 symbols').isLength({min: 15}).isString(),
]

export const emailValidation = [
  body('email', 'Wrong email format').isEmail(),
]

export const passwordValidation = [
  body('password1', 'Password min length should be 5 symbols').isLength({min: 5}),
  body('password2', 'Password min length should be 5 symbols').isLength({min: 5}),
  body('email', 'Wrong email format').isEmail(),
]

