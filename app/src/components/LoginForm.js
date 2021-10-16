
import React, { useState } from 'react'
import loginService from '../services/login'
import notifyWith from '../utils/notifyWith'

const LoginForm = ({ setUser, setNotification }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (err) {
      notifyWith('Wrong username o password', 'error', setNotification)
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <div>
        Username
        <input type='text' name='Username' value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        Password
        <input type='text' name='Password' value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type='submit' className='login-btn'>Login</button>
    </form>
  )
}
export default LoginForm
