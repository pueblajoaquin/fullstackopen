import { test, expect } from '@playwright/test'
import { loginWith, logout, createBlog } from './helper'

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Joaquin Puebla',
        username: 'joakou',
        password: '123abc'
      }
    })  
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
   await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible()

   await page.getByRole('button', { name: 'Log in' }).click()

   await expect(page.getByRole('heading', { name: 'log in to application' })).toBeVisible()
   await expect(page.getByLabel('username')).toBeVisible()
   await expect(page.getByLabel('password')).toBeVisible()
   await expect(page.getByRole('button', { name: 'login', exact: true })).toBeVisible()
  })

  test.describe('Login',() => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'joakou', '123abc')

      await expect(page.getByText('joakou logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'joakou', 'wrong')

      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await loginWith(page, 'joakou', '123abc')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'title of blog', 'author of blog', 'urlofblog.com')
      await expect(page.getByText('title of blog author of blog')).toBeVisible()
    })

    test('a blog can be edited, when received a like', async ({page}) => {
      await createBlog(page, 'title of blog', 'author of blog', 'urlofblog.com')

      await page.getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    test('a blog can be deleted by the user who created it', async ({page}) => {
      await createBlog(page, 'title of blog', 'author of blog', 'urlofblog.com')

      await expect(page.getByText('title of blog author of blog')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async (dialog) => {
        expect(dialog.type()).toBe('confirm')
        expect(dialog.message()).toContain('Remove title of blog by author of blog?')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('title of blog author of blog')).not.toBeVisible()
    })

    test('only the user who created a blog sees the remove button', async ({ page, request }) => {
      await request.post('/api/users', {
        data: {
          name: 'Other User',
          username: 'other',
          password: '123abcc'
        }
      })

      await createBlog(page, 'title of blog', 'author of blog', 'urlofblog.com')

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()

      await logout(page)
      await loginWith(page, 'other', '123abcc')

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('user: joakou')).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered by likes, the most liked first', async ({ page }) => {
      await createBlog(page, 'least liked', 'author a', 'a.com')
      await createBlog(page, 'most liked', 'author b', 'b.com')
      await createBlog(page, 'middle liked', 'author c', 'c.com')

      const most = page.getByText('most liked author b')
      await most.getByRole('button', { name: 'view' }).click()
      await most.getByRole('button', { name: 'like' }).click()
      await expect(most.getByText('likes: 1')).toBeVisible()
      await most.getByRole('button', { name: 'like' }).click()
      await expect(most.getByText('likes: 2')).toBeVisible()

      const middle = page.getByText('middle liked author c')
      await middle.getByRole('button', { name: 'view' }).click()
      await middle.getByRole('button', { name: 'like' }).click()
      await expect(middle.getByText('likes: 1')).toBeVisible()

      await expect(page.getByText(/^(least|most|middle) liked author/)).toContainText([
        'most liked',
        'middle liked',
        'least liked'
      ])
    })
  })
})
