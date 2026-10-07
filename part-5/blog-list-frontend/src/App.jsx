import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  
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

  const handleLogin = async (event) => {
    event.preventDefault()

    try{
      const user = await loginService.login({
      username,
      password
      })
      window.localStorage.setItem('userLogged', JSON.stringify(user))
      setUsername('')
      setPassword('')
      setUser(user)
      blogService.setToken(user.token)
      showMessage(`successful login for ${user.username}`)
    }catch (error){
      showMessage(error.response.data.error, 'error')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('userLogged')
    setUser(null)
    showMessage('closed session')
  }

  const handleAddBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title,
      author,
      url
    }
    try{
      const blogCreated = await blogService.createBlog(newBlog)
      setTitle('')
      setAuthor('')
      setUrl('')
      setBlogs(blogs.concat(blogCreated))
      showMessage(`a new blog ${blogCreated.title} by ${blogCreated.author} added`)
    }catch (error){
      showMessage(error.response.data.error)
    }
  }

  const showMessage = (message, type = 'message') => {
    setMessage({message, type})
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <label >
          username
          <input
            type="text"
            value = {username}
            onChange={({target}) => setUsername(target.value)}
          />
        </label>
        <label >
          password
          <input 
            type="password" 
            value = {password}
            onChange={({target}) => setPassword(target.value)} 
          />
        </label>
        <button type='submit'>login</button>
      </form>
    </div>
  )

  const blogsData =() => (
    <div>
      <h2>blogs</h2>

      <p>{user.username} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <h3>create new</h3>
      <form onSubmit={handleAddBlog}>
        <label >
          title
          <input 
            type ="text"
            value = {title}
            onChange={({target}) => setTitle(target.value)}
          />
        </label>
        <label >
          author
          <input 
            type = "text"
            value = {author}
            onChange={({target}) => setAuthor(target.value)}
          />
        </label>
        <label >
          url
          <input 
            type ="text"
            value = {url}
            onChange = {({target}) => setUrl(target.value)}
          />
        </label>
        <button type='submit'>create</button>
      </form>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  return (
    <div>
      <Notification message={message} />
      {!user && loginForm()}
      {user && blogsData()}
    </div>
  )
}

export default App