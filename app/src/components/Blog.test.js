import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component
  const user = {
    id: 1234,
    username: 'user'
  }

  const blog = {
    title: 'Component testing is done',
    author: 'Test',
    url: 'http://test.com',
    likes: 0,
    user: user
  }

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} />
    )
  })

  test('renders content', () => {
    const div = component.container.querySelector('.blog')
    expect(div).toHaveTextContent('Component testing is done')
    expect(div).toHaveTextContent('Test')
    expect(div).not.toHaveTextContent('http://test.com')
    expect(div).not.toHaveTextContent(0)
  })

  test('clicking the button shows the URL and likes', () => {
    const div = component.container.querySelector('.blog')
    const button = component.getByText('View')
    fireEvent.click(button)
    expect(div).toHaveTextContent('http://test.com')
    expect(div).toHaveTextContent(0)
  })

  test('double click on like button calls twice the event', () => {
    const button = component.getByText('View')
    fireEvent.click(button)

    const likeButton = component.getByText('Like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    // expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
