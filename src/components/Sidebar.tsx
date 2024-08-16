import Link from 'next/link'
import React from 'react'
import { BiMenuAltLeft } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'
import NavLink from './NavLink'
import SwitchTheme from './SwitchTheme'

type Props = {}

const Sidebar = (props: Props) => {
  return (
    <div className="drawer sm:hidden flex ">
      <input id="my-drawer"
        type="checkbox"
        className="drawer-toggle" 
      />
      <div className="drawer-content">
        {/* Page content here */}
        <label htmlFor="my-drawer"
          className="btn drawer-button"
        ><BiMenuAltLeft size={24} /></label>
      </div> 
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li className='flex flex-row-reverse'>
            <label htmlFor="my-drawer"
              className="btn drawer-button"
            >
              <IoMdClose size={24} />
            </label>
          </li>
          {/* <NavLink href={'/'}
            inputId='my-drawer'
          >KNN</NavLink>
          <NavLink href={'/'}
            inputId='my-drawer'
          >SVM</NavLink> */}
          <li><NavLink href={'#datamentah'} inputId='my-drawer'>Data Mentah</NavLink></li>
          <li>
            <details>
              <summary>Preprocessing</summary>
              <ul>
                <li><NavLink href={'#cleaning'} inputId='my-drawer'>Cleaning Data</NavLink></li>
                <li><NavLink href={'#normalisasidata'} inputId='my-drawer'>Normalisasi Data</NavLink></li>
              </ul>
            </details>
          </li>
          <li>
            <details>
              <summary>Processing</summary>
              <ul>
                <li>
                  <NavLink href={'#svm'} inputId='my-drawer'>SVM</NavLink>
                  <NavLink href={'#knn'} inputId='my-drawer'>KNN</NavLink>
                </li>
              </ul>
            </details>
          </li>
          <li><NavLink href={'#confusingmatrix'} inputId='my-drawer'>Confusing Matrix</NavLink></li>
          <li>

          <SwitchTheme />
          </li>
        </ul>
      </div>
     
    </div>
  )
}

export default Sidebar