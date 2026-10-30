import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useMatch
} from 'react-router-dom'
import LoginForm from './components/LoginForm'
import HomeBlogs from './components/HomeBlogs'
import BlogView from './components/BlogView'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()
  const blogMatch = useMatch('/blogs/:id')
  const matchedBlog = blogMatch
    ? blogs.find(b => b.id === blogMatch.params.id)
    : null


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('userLogged')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async ({ username, password }) => {
    try{
      const user = await loginService.login({
        username,
        password
      })
      window.localStorage.setItem('userLogged', JSON.stringify(user))
      setUser(user)
      blogService.setToken(user.token)
      showMessage(`successful login for ${user.username}`)
      navigate('/')
    }catch (error){
      showMessage(error.response.data.error, 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('userLogged')
    setUser(null)
    showMessage('closed session')
    navigate('/')
  }

  const handleAddBlog = async ({ title, author, url }) => {
    const newBlog = {
      title,
      author,
      url
    }
    try{
      const blogCreated = await blogService.createBlog(newBlog)
      setBlogs(blogs.concat(blogCreated))
      showMessage(`a new blog ${blogCreated.title} by ${blogCreated.author} added`)
      navigate('/')
    }catch (error){
      showMessage(error.response.data.error)
    }
  }

  const handleRemoveBlog = async(blog) => {
    if(window.confirm(`Remove ${blog.title} by ${blog.author}?`)){
      try{
        await blogService.removeBlog(blog.id)
        const newBlogsWithoutDeleted = blogs.filter(b => b.id !== blog.id)
        setBlogs(newBlogsWithoutDeleted)
        navigate('/')
      }catch(error){
        showMessage(error.response.data.error, 'error')
      }
    }
  }

  const handleLikeBlog = async(blog) => {

    const updatedBlog = await blogService.updateBlog({
      title:blog.title ,
      author:blog.author ,
      url:blog.url ,
      likes:blog.likes ,
      user:blog.user ,
      idBlog: blog.id
    },)
    // added `populate` to the blog returned in the PUT request
    const blogsUpdated = blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b)
    setBlogs(blogsUpdated)

  }

  const showMessage = (message, type = 'message') => {
    setMessage({ message, type })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }



  return (
    <div>
      <div>
        <Link to="/">blogs</Link>
        {user?
          <>
            <Link to="/create">new blog</Link>
            <button onClick={handleLogout}>logout</button>
          </>
          : <Link to="/login">login</Link>
        }
      </div>

      <Notification message={message} />

      <Routes>
        <Route path="/" element={
          <HomeBlogs
            blogs={blogs}
          />
        }/>
        <Route path="/blogs/:id" element={
          <BlogView
            blog={matchedBlog}
            user={user}
            handleLikeBlog={handleLikeBlog}
            handleRemoveBlog={handleRemoveBlog}
          />
        }/>
        <Route path="/login" element={
          <LoginForm handleLogin={handleLogin}/>
        }/>
        <Route path="/create" element={
          <BlogForm handleAddBlog={handleAddBlog}/>
        }/>
      </Routes>
    </div>
  )
}

export default App

