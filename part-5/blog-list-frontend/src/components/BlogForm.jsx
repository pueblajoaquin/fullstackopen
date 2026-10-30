import { useState } from 'react'

const BlogForm = ({ handleAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const createBlog = event => {
    event.preventDefault()
    handleAddBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h3>create new blog</h3>
      <form onSubmit={createBlog}>
        <label >
          title
          <input
            type ="text"
            value = {title}
            placeholder = 'write blog title here'
            onChange={({ target }) => setTitle(target.value)}
          />
        </label>
        <label >
          author
          <input
            type = "text"
            value = {author}
            placeholder = 'write blog author here'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </label>
        <label >
          url
          <input
            type ="text"
            value = {url}
            placeholder = 'write blog url here'
            onChange = {({ target }) => setUrl(target.value)}
          />
        </label>
        <button type='submit'>create</button>
      </form>
    </div>
  )

}

export default BlogForm