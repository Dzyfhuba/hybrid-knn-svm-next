import React from 'react'
import { BiMenuAltLeft } from 'react-icons/bi'
import { IoMdClose } from 'react-icons/io'

type Props = {}

const Sidebar = (props: Props) => {
  return (
    <div className="drawer sm:hidden flex">
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
      <div className="drawer-side">
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
          <li><a>Sidebar Item 1</a></li>
          <li><a>Sidebar Item 2</a></li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar