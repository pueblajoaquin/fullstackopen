import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title:'blogs title',
    author:'testing',
    url:'test.com',
    likes: 5,
    user: { username: 'testUser' }
  }
  let handleLikeBlog

  beforeEach(() => {
    handleLikeBlog = vi.fn()
    render(
      <Blog
        blog={blog}
        handleLikeBlog={handleLikeBlog}
      />
    )
  })

  test('by default the title and author are displayed, but not the url or likes',() => {

    expect(screen.getByText('blogs title', { exact: false })).toBeDefined()
    expect(screen.getByText('testing', { exact: false })).toBeDefined()


    expect(screen.queryByText('likes:', { exact: false })).toBeNull()
    expect(screen.queryByText(blog.url , { exact: false })).toBeNull()
  })

  test('the url and likes are displayed when the button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    expect(screen.getByText('likes:' , { exact: false })).toBeDefined()
    expect(screen.getByText(blog.url , { exact: false })).toBeDefined()
  })

  test('if the like button is clicked twice, the event handler is called twice',async () => {
    const user = userEvent.setup()
    const buttonView = screen.getByText('view')
    await user.click(buttonView)

    const buttonLike = screen.getByText('like')
    await user.click(buttonLike)
    await user.click(buttonLike)

    expect(handleLikeBlog.mock.calls).toHaveLength(2)
  })
})