import Blog from '../models/blog.js'
import User from '../models/user.js'

export const listWithManyBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

export const listWithOneBlog = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
  }
]

export const listWithManyUsers = [
  {
    username: 'joakou',
    name: 'Joaquin',
    password: 'asdasd',
  },
  {
    username: 'jaz',
    name: 'Jazmin',
    password: 'asdasdasd',
  },
  {
    username: 'jose',
    name: 'Jose',
    password: 'asdfsdasdasd',
  },
  {
    username: 'roquito',
    name: 'Roko',
    password: 'miau'
  }
]

export const userTestData = {
  username: 'rootTest',
  password: 'password123',
  name: 'Test'
}

export const usersInDb = async () => {
  return await User.find({})
}
export const blogsInDb = async () => {
  return await Blog.find({})
}
