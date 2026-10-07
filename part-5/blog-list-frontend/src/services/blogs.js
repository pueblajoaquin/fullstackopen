import axios, { create } from 'axios'
const baseUrl = '/api/blogs'

let token

const setToken = newToken => {
  token = newToken
}

const getAll = async () => {

  const response = await axios.get(baseUrl)
  return response.data
}

const createBlog = async({title, author, url}) =>{
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

export default { 
  getAll,
  setToken,
  createBlog
}