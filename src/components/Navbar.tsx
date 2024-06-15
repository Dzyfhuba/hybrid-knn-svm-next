import React, { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import SwitchTheme from './SwitchTheme'
import Link from 'next/link'
import Sidebar from './Sidebar'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <main className="">
      <div className="navbar bg-base-100 sm:flex flex-row-reverse sm:flex-row">
        <div className="flex-1">
          <button className="btn btn-ghost text-xl">daisyUI</button>
        </div>
        <div className="flex-none hidden sm:block">
          <ul className="menu menu-horizontal px-1">
            <li><Link href={'/'}>Link</Link></li>
            <li>
              <details>
                <summary>
                  Parent
                </summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  <li><Link href={'/'}>Link 1</Link></li>
                  <li><Link href={'/'}>Link 2</Link></li>
                </ul>
              </details>
            </li>
          </ul>
        </div>
        <Sidebar />
      </div>
    </main>
  )
}

export default Navbar