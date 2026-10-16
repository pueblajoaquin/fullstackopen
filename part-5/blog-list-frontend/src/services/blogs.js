import axios from 'axios'
const baseUrl = '/api/blogs'

let token

const setToken = newToken => {
  token = newToken
}

const getAll = async () => {

  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async({ title, author, url }) => {
  const config = {
    headers : {
      Authorization: `Bearer ${token}`
    }
  }
  const newBlog ={
    title,
    author,
    url
  }
  const response = await axios.post(baseUrl,newBlog,config)
  return response.data
}

const updateBlog = async ({ title, author, url, likes, user, idBlog }) => {
  const newBlog={
    title,
    author,
    url,
    likes: likes + 1,
    user
  }

  const response = await axios.put(`${baseUrl}/${idBlog}`, newBlog)

  return response.data
}

const removeBlog = async (idBlog) => {
  const config = {
    headers : {
      Authorization: `Bearer ${token}`
    }
  }
  await axios.delete(`${baseUrl}/${idBlog}`,config)
}

export default {
  getAll,
  setToken,
  createBlog,
  updateBlog,
  removeBlog
}