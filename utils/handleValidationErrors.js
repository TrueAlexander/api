import { validationResult } from 'express-validator'

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  //if there are errors after the validation
  if (!errors.isEmpty()) {
    return res.status(400).json(errors.array())
  } else {
    next()
  } 
}

export default handleValidationErrors