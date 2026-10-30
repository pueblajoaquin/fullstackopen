import { Link } from 'react-router-dom'
import BlogForm from './BlogForm'

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5
}

const HomeBlogs = ({ blogs }) => {
  const sorted = [...blogs].sort((a, b) => b.likes - a.likes )

  return (
    <div>
      <h2>blogs</h2>

      {
        sorted.map(blog =>
          <div key={blog.id} style={blogStyle}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
          </div>
        )
      }
    </div>
  )
}

export default HomeBlogs
