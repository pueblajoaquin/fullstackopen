import User from '../models/user.js'
import Blog from '../models/blog.js'
import { Router } from 'express'

const testRoutes = Router()

testRoutes.post('/reset', async (req, res) => {
  await User.deleteMany({})
  await Blog.deleteMany({})
  console.log('clear bd')
  res.status(204).end()
})

export default testRoutes
