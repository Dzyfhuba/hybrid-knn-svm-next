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
          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0}
              role="button"
              className="btn m-1 btn-ghost"
            >KNN</div>
            <ul tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={'#'}>Item 1</Link>
              </li>
              <li><Link href={'#'}>Item 2</Link></li>
            </ul>
          </div>
          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0}
              role="button"
              className="btn m-1 btn-ghost"
            >SVM</div>
            <ul tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><Link href={'#'}>Item 1</Link></li>
              <li><Link href={'#'}>Item 2</Link></li>
            </ul>
          </div>
        </div>
        <Sidebar />
      </div>
    </main>
  )
}

export default Navbar