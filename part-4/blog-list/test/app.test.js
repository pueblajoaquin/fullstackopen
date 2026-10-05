import { test, describe, after, beforeEach } from 'node:test'
import supertest from 'supertest'
import assert from 'node:assert'
import app from '../app.js'
import Blog from '../models/blog.js'
import User from '../models/user.js'
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { listWithManyBlogs, listWithManyUsers, userTestData, blogsInDb } from './test_helper.js'

const api = supertest(app)

let token

beforeEach(async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const userTest = await new User({
    username: userTestData.username,
    name: userTestData.name,
    passwordHash: await bcrypt.hash(userTestData.password, 1)
  }).save()

  token = jwt.sign(
    { username: userTest.username, id: userTest.id },
    process.env.SECRET
  )

  const userObjects = listWithManyUsers.map(async (user) => {
    const newUser = {
      username: user.username,
      name: user.name,
      passwordHash: await bcrypt.hash(user.password, 1)
    }
    return new User(newUser)
  })
  const users = await Promise.all(userObjects)
  const promiseArrayUsers = users.map(user => user.save())
  await Promise.all(promiseArrayUsers)

  const blogObjects = listWithManyBlogs.map((blog) => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes,
      user: userTest.id
    }
    return new Blog(newBlog)
  })
  const savedBlogs = await Promise.all(blogObjects.map(blog => blog.save()))
  userTest.blogs = savedBlogs.map(blog => blog._id)
  await userTest.save()
})

describe('GET /api/blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned in a get request', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, listWithManyBlogs.length)
  })

  test('the id property is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
      assert.strictEqual(blog._id, undefined)
      assert(blog.id)
    })
  })
})

describe('POST /api/blogs', () => {
  test('a valid  blog can be added with a valid token', async () => {
    const blogsAtStart = await blogsInDb()
    const newBlog = {
      title: 'test of add new blog',
      author: 'app.test.js',
      url: 'app.com',
      likes: 123
    }

    const response = await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)

    assert(titles.includes('test of add new blog'))

    const user = await User.findById(response.body.user)

    assert(user.blogs.includes(response.body.id))
  })

  test('a valid blog cant be added without a valid token', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'test of add new blog',
      author: 'app.test.js',
      url: 'app.com',
      likes: 123
    }

    await api.post('/api/blogs')
      .set('Authorization', 'Bearer invalid-token')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('a valid blog cant be added without a token', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'test of add new blog',
      author: 'app.test.js',
      url: 'app.com',
      likes: 123
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('value default of likes is zero', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'test of likes value',
      author: 'app.test.js',
      url: 'app.com',
    }

    const response = await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)

    const blogsAtEnd = await blogsInDb()

    assert(blogsAtEnd.length, blogsAtStart.length + 1)
  })

  test('error while try create a blog without a title', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlogWithOutTitle = {
      author: 'app.test.js',
      url: 'app.com',
    }

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithOutTitle)
      .expect(400)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('error while try create a blog without a url', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlogWithOutTitle = {
      title: 'titletitle',
      author: 'app.test.js',
    }

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithOutTitle)
      .expect(400)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('error while try create a blog without a url and a title', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlogWithOutTitle = {
      author: 'app.test.js',
    }

    await api.post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlogWithOutTitle)
      .expect(400)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('DELETE /api/blogs/:id', () => {
  test('a blog can be deleted with a valid token', async () => {
    const blogsAtStart = await blogsInDb()

    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    const ids = blogsAtEnd.map(blog => blog.id)

    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
  })

  test('a blog cant be deleted with other valid token', async () => {
    const blogsAtStart = await blogsInDb()

    const otherUser = await User.findOne({
      username: listWithManyUsers[0].username
    })

    const otherToken = jwt.sign(
      { username: otherUser.username, id: otherUser.id },
      process.env.SECRET
    )

    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(403)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('a blog cant be deleted without token', async () => {
    const blogsAtStart = await blogsInDb()

    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401)

    const blogsAtEnd = await blogsInDb()

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('PUT /api/blogs/:id', () => {
  test('a likes of blogs can be updated', async () => {
    const blogs = await api.get('/api/blogs')

    const blogToUpdate = blogs.body[0]

    const newLikes = {
      likes: blogToUpdate.likes + 1
    }

    const blogUpdated = await api.put(`/api/blogs/${blogToUpdate.id}`)
      .send(newLikes)

    assert(blogUpdated.body.likes, blogToUpdate.likes + 1)
  })
})

describe('POST /api/users', () => {
  test('a username of fewer than 3 characters is invalid', async () => {
    const UsersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'jo',
      name: 'Joaquin',
      password: 'password123'
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(400)

    const UsersAtEnd = await api.get('/api/users')

    assert.strictEqual(UsersAtEnd.body.length, UsersAtStart.body.length)
  })

  test('a password of fewer than 3 characters is invalid', async () => {
    const UsersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'joakouuus',
      name: 'Joaquin',
      password: 'pa'
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(400)

    const UsersAtEnd = await api.get('/api/users')

    assert.strictEqual(UsersAtEnd.body.length, UsersAtStart.body.length)
  })

  test('error while create a user without username', async () => {
    const UsersAtStart = await api.get('/api/users')

    const newUser = {
      name: 'Joaquin',
      password: 'password'
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(400)

    const UsersAtEnd = await api.get('/api/users')

    assert.strictEqual(UsersAtEnd.body.length, UsersAtStart.body.length)
  })

  test('error while create a user without password', async () => {
    const UsersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'joakouuu',
      name: 'Joaquin',
    }
    await api.post('/api/users')
      .send(newUser)
      .expect(400)

    const UsersAtEnd = await api.get('/api/users')

    assert.strictEqual(UsersAtEnd.body.length, UsersAtStart.body.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
