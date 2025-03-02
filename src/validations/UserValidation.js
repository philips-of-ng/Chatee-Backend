import Joi from 'joi'

const userSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  fullName: Joi.string(),
  userName: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
  displayPicture: Joi.string()
})

export default userSchema
