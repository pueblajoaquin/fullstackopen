import { Router } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.js'

const userRouter = Router()

userRouter.get('/', async (request, response) => {
  const users = await User.find({})
    .populate('blogs', {
      title: true,
      author: true,
      likes: true
    })
  return response.status(200).json(users)
})

userRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'password is missing' })
  }

  if (password.length < 3) {
    return response.status(400).json({ error: 'password must be greater than 3' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  return response.status(201).json(savedUser)
})

export default userRouter
