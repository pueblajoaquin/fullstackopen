const dummy = (blogs) => {
  return 1
}

const totalLikes = (listBlogs) => {
  return listBlogs
    .map(blog => blog.likes)
    .reduce((sum, likes) => {
      return sum + likes
    }, 0)
}

const favoriteBlog = (listBlogs) => {
  if (listBlogs.length === 0) return null
  let favorite = listBlogs[0]
  listBlogs.forEach(blog => {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  })
  return favorite
}

const mostBlogs = (listBlogs) => {
  if (listBlogs.length === 0) {
    return { author: null, blogs: null }
  }

  const countBlogsAuthors = listBlogs
    .reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + 1
      return acc
    }, {})

  const cantMaxOfBlogs = Math.max(...Object.values(countBlogsAuthors))
  const nameOfMaxBlogs = Object.keys(countBlogsAuthors).find(author => countBlogsAuthors[author] === cantMaxOfBlogs)

  return {
    author: nameOfMaxBlogs,
    blogs: cantMaxOfBlogs
  }
}

const mostLikes = (listBlogs) => {
  if (listBlogs.length === 0) {
    return { author: null, likes: null }
  }

  const countLikeAuthors = listBlogs
    .reduce((acc, blog) => {
      acc[blog.author] = (acc[blog.author] || 0) + blog.likes
      return acc
    }, {})

  const cantMaxOfLikes = Math.max(...Object.values(countLikeAuthors))
  const nameOfMaxLikes = Object.keys(countLikeAuthors).find(author => countLikeAuthors[author] === cantMaxOfLikes)

  return {
    author: nameOfMaxLikes,
    likes: cantMaxOfLikes
  }
}

export default { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
