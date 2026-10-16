import { useState } from 'react'
import Togglable from './Togglable'


const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const login = event => {
    event.preventDefault()

    handleLogin({
      username,
      password
    })
    setPassword('')
    setUsername('')
  }

  return (
    <Togglable buttonLabel='Log in'>
      <h2>log in to application</h2>
      <form onSubmit={login}>
        <label >
          username
          <input
            type="text"
            value = {username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label >
          password
          <input
            type="password"
            value = {password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type='submit'>login</button>
      </form>
    </Togglable>
  )
}

export default LoginForm