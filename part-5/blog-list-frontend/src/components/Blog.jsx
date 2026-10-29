import { useState } from 'react'



const Blog = ({ blog, handleLikeBlog, handleRemoveBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return(
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>
        {visible ? 'hide' : 'view'}
      </button>
      {visible ? (
        <ul>

          <li>{blog.url}</li>

          <li>
            likes: {blog.likes}
            <button onClick={() => handleLikeBlog(blog)} >like</button>
          </li>

          <li>user: {blog.user.username}</li>

          {user.username === blog.user.username && <li><button onClick={() => handleRemoveBlog(blog)}>remove</button></li>}

        </ul>
      ) : null}
    </div>
  )
}

export default Blog