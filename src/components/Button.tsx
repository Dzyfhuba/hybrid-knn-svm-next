import React, { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

const Button = ({ className, ...props }: Props) => {
  return (
    <button
      className={`${className}`}
      {...props}
    >
      {props.children}
    </button>
  )
}

export default Button