import React from 'react'

type Props = {
  data: string
  className: string
  children: string
}

const Button = (props: Props) => {
  return (
    <button data-id={`${props.data}`}
      className={`${props.className}`}
    >
      {props.children}
    </button>
  )
}

export default Button