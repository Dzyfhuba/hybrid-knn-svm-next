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

          <Link className="btn btn-ghost"
            href={'#datamentah'}
          >Data Mentah</Link>

          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0}
              role="button"
              className="btn m-1 btn-ghost"
            >Prepocessing</div>
            <ul tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={'#cleaning'}>Cleaning Data</Link>
              </li>
              <li><Link href={'#normalisasidata'}>Normalisasi Data</Link></li>
            </ul>
          </div>

          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0}
              role="button"
              className="btn m-1 btn-ghost"
            >Processing</div>
            <ul tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li><Link href={'#svm'}>SVM</Link></li>
              <li><Link href={'#knn'}>KNN</Link></li>
            </ul>
          </div>

          <Link className="btn btn-ghost"
            href={'#confusingmatrix'}
          >Confusing Matrix</Link>
          
        </div>
        <Sidebar />
      </div>

    </main>
  )
}

export default Navbar