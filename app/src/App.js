import './App.css'
import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import notifyWith from './utils/notifyWith'
import Togglable from './components/Togglable.js'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (e) => {
    e.preventDefault()
    const title = document.querySelector('.title')
    const author = document.querySelector('.author')
    const url = document.querySelector('.url')

    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value
    }
    blogFormRef.current.toggleVisibility()
    blogService.setToken(user.token)
    blogService.create(newBlog)
      .then(returnedBlog => setBlogs(blogs.concat(returnedBlog)))

    notifyWith(`A new blog '${newBlog.title}' by '${newBlog.author}' has been added`, 'success', setNotification)
    title.value = ''
    author.value = ''
    url.value = ''
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  return (
    <div>
      {user === null
        ? (
          <div className='blogs'>
            <h2>Blogs</h2>
            <h3>Log in to application</h3>
            <Notification notification={notification} />
            <LoginForm
              setUser={setUser}
              setNotification={setNotification}
            />
          </div>
        )
        : (
          <div className='blogs'>
            <h2>Blogs</h2>
            <Notification notification={notification} />
            <div>
              <div className='logged-div'>
                <p>{user.name} Logged-in</p>
                <button type='button' onClick={handleLogout} className='logout-btn'>Log out</button>
              </div>
              <Togglable buttonLabel='New blog' ref={blogFormRef}>
                <BlogForm addBlog={addBlog} />
              </Togglable>
              <div className='bloglist'>
                {(blogs.sort((a, b) => b.likes - a.likes)).map(blog =>
                  <Blog key={blog.id} blog={blog} blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} user={user} />
                )}
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

export default App
