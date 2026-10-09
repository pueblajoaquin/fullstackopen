import Blog from '../models/blog.js'
import middleware from '../utils/middleware.js'
import { Router } from 'express'

const blogRoutes = Router()

blogRoutes.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', {
      username: true,
      name: true
    })

  return response.json(blogs)
})

blogRoutes.post('/', middleware.userExtractor, async (request, response) => {
  const { title, author, url, likes } = request.body

  const { user } = request

  const newBlog = {
    title,
    author,
    user: user.id,
    url,
    likes
  }

  const blog = new Blog(newBlog)

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  return response.status(201).json(savedBlog)
})

blogRoutes.delete('/:id', middleware.userExtractor, async (request, response) => {
  const { user } = request

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (!(blog.user.toString() === user.id)) {
    return response.status(403).json({ error: 'only the creator can delete this blog' })
  }
  user.blogs = user.blogs.filter(b => b.toString() !== blog.id)
  await user.save()

  await blog.deleteOne()

  return response.status(204).end()
})

blogRoutes.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { returnDocument: 'after', runValidators: true, context: 'query' })
    .populate('user', { username: true, name: true })

  if (updatedBlog) {
    return response.json(updatedBlog)
  } else {
    return response.status(404).end()
  }
})

export default blogRoutes
