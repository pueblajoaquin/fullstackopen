import { test, describe } from 'node:test'
import assert from 'node:assert'
import listHelper from '../utils/listHelper.js'
import { listWithManyBlogs, listWithOneBlog } from './test_helper.js'

describe('dummy', () => {
  test('returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('when list has many blogs, equals most be correct ', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 36)
  })

  test('when list is empty, the result must be zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })
})

describe('favorite blog', () => {
  test('when list is empty', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has only one blog, the result must be itself', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    const expected = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5
    }
    assert.deepStrictEqual(result, expected)
  })

  test('when list has many blogs', () => {
    const result = listHelper.favoriteBlog(listWithManyBlogs)
    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }
    assert.deepStrictEqual(result, expected)
  })
})

describe('most blogs', () => {
  test('when list is empty', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), { author: null, blogs: null })
  })

  test('when list has only one blog', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), { author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('when list has many blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithManyBlogs), { author: 'Robert C. Martin', blogs: 3 })
  })
})

describe('most likes', () => {
  test('when list is empty', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), { author: null, likes: null })
  })

  test('when list has only one blog', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), { author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('when list has many blogs', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithManyBlogs), { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})
