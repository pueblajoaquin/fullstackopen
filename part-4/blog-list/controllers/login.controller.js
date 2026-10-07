import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { Router } from 'express'

const loginRouter = Router()

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const correctPassword = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && correctPassword)) {
    console.log('entre')
    return response.status(401).json({ error: 'invalid username or password' })
  }

  const userForToken = {
    username,
    id: user.id
  }

  const token = jwt.sign(
    userForToken,
    process.env.SECRET
  )

  response.status(200).json({
    token,
    username: user.username
  })
})

export default loginRouter
