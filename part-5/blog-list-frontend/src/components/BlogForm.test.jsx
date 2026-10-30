import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('calls handleAddBlog with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const handleAddBlog = vi.fn()

    render(<BlogForm
      handleAddBlog={handleAddBlog}
    />)

    await user.type(screen.getByPlaceholderText('write blog title here'), 'blogs title')
    await user.type(screen.getByPlaceholderText('write blog author here'), 'testing')
    await user.type(screen.getByPlaceholderText('write blog url here'), 'test.com')

    const buttonSend = screen.getByRole('button', { name: 'create' })
    await user.click(buttonSend)

    expect(handleAddBlog).toHaveBeenCalledTimes(1)
    expect(handleAddBlog).toHaveBeenCalledWith({
      title: 'blogs title',
      author: 'testing',
      url: 'test.com'
    })
  })
})