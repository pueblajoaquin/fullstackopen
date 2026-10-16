import BlogForm from './BlogForm'
import Blog from './Blog'
const HomeBlogs = ({ handleLogout, handleAddBlog, handleRemoveBlog, handleLikeBlog, blogs, user }) => {
  const sorted = [...blogs].sort((a, b) => b.likes - a.likes )

  return (
    <div>
      <h2>blogs</h2>

      <p>{user.username} logged in</p>
      <button onClick={handleLogout}>logout</button>

      <BlogForm handleAddBlog={handleAddBlog} />

      {
        sorted.map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLikeBlog={handleLikeBlog}
            handleRemoveBlog={handleRemoveBlog}
          />
        )
      }
    </div>
  )
}

export default HomeBlogs