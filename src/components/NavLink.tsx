'use client'

import Link, { LinkProps } from 'next/link'
import React, { HTMLAttributes, ReactNode } from 'react'

type Props = LinkProps & HTMLAttributes<HTMLElement> & {
  children: ReactNode
  inputId?: string
}

const NavLink = ({ inputId ,...props }: Props) => {
  return (
    <Link className='p-4 w-full min-h-full bg-base-200 text-base-content'
      {...props}
      onClick={() => document.getElementById(inputId || '')?.click()}
    >{props.children}</Link>
  )
}

export default NavLink