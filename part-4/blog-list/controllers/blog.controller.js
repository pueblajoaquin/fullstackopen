import Blog from '../models/blog.js'
import { Router } from 'express'

const blogRoutes = Router()

blogRoutes.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogRoutes.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

export default blogRoutes
