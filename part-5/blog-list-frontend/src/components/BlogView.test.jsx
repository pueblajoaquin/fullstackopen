import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogView from './BlogView'

describe('<BlogView />', () => {
  const blog = {
    title:'blogs title',
    author:'testing',
    url:'test.com',
    likes: 5,
    user: { username: 'testUser' }
  }
  let handleLikeBlog
  let handleRemoveBlog

  beforeEach(() => {
    handleLikeBlog = vi.fn()
    handleRemoveBlog = vi.fn()
  })

  const renderBlogView = (user) => {
    render(
      <BlogView
        blog={blog}
        user={user}
        handleLikeBlog={handleLikeBlog}
        handleRemoveBlog={handleRemoveBlog}
      />
    )
  }

  test('a user that is not logged in sees the blog info and likes, but no buttons', () => {
    renderBlogView(null)

    expect(screen.getByText('blogs title', { exact: false })).toBeDefined()
    expect(screen.getByText('testing', { exact: false })).toBeDefined()
    expect(screen.getByText(blog.url , { exact: false })).toBeDefined()
    expect(screen.getByText('likes:' , { exact: false })).toBeDefined()

    expect(screen.queryByRole('button')).toBeNull()
  })

  test('a logged user that is not the creator sees only the like button', () => {
    renderBlogView({ username: 'otherUser' })

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.queryByText('remove')).toBeNull()
  })

  test('the creator sees the like and remove buttons', () => {
    renderBlogView({ username: 'testUser' })

    expect(screen.getByText('like')).toBeDefined()
    expect(screen.getByText('remove')).toBeDefined()
  })

  test('if the like button is clicked twice, the event handler is called twice',async () => {
    const user = userEvent.setup()
    renderBlogView({ username: 'otherUser' })

    const buttonLike = screen.getByText('like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(handleLikeBlog.mock.calls).toHaveLength(2)
  })
})
