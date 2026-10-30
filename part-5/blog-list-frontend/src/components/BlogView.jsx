const BlogView = ({ blog, user, handleLikeBlog, handleRemoveBlog }) => {
  if (!blog) {
    return null
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <div>{blog.url}</div>
      <div>
        likes: {blog.likes}
        {user && <button onClick={() => handleLikeBlog(blog)}>like</button>}
      </div>
      <div>added by {blog.user.username}</div>
      {user?.username === blog.user.username &&
        <button onClick={() => handleRemoveBlog(blog)}>remove</button>
      }
    </div>
  )
}

export default BlogView
