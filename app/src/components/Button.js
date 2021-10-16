
import React from 'react'

const Button = ({ handle, classButton, textLabel }) => {
  return (
    <div>
      <button className={classButton} onClick={handle}>{textLabel}</button>
    </div>
  )
}

export default Button
