import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import BlogForm from './BlogForm'

test('<BlogForm />', () => {
  const addBlog = jest.fn()

  const component = render(
    <BlogForm addBlog={addBlog} />
  )

  const form = component.container.querySelector('form')
  const title = component.container.querySelector('.title')
  const author = component.container.querySelector('.author')
  const url = component.container.querySelector('.url')

  fireEvent.change(title, {
    target: { value: 'Testing blog from' }
  })
  fireEvent.change(author, {
    target: { value: 'Test' }
  })
  fireEvent.change(url, {
    target: { value: 'test.com' }
  })
  fireEvent.submit(form)

  expect(addBlog.mock.calls).toHaveLength(1)
})
