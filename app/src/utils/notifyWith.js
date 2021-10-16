const notifyWith = (message, type, setNotification) => {
  setNotification({ message, type })
  setTimeout(() => {
    setNotification(null)
  }, 4000)
}

export default notifyWith
