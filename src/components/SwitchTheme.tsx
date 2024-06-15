'use client'

import { useTheme } from 'next-themes'
import { FaMoon, FaSun } from 'react-icons/fa'
import { MdOutlineComputer } from 'react-icons/md'

const SwitchTheme = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div>
      <div className="join rounded-full p-1 bg-base-200 w-max">
        {/* <input type="radio" name="theme-buttons" className="btn theme-controller join-item" aria-label="Default" value="default" /> */}
        <button className={`btn btn-sm join-item !rounded-full btn-ghost ${theme == 'light' ? ' bg-base-100':''}`}
          onClick={() => setTheme('light')}
        >
          <FaSun />
        </button>
        <button className={`btn btn-sm join-item !rounded-full btn-ghost ${!theme ? ' bg-base-100':''}`}
          onClick={() => setTheme('system')}
        >
          <MdOutlineComputer />
        </button>
        <button className={`btn btn-sm join-item !rounded-full btn-ghost ${theme == 'dark' ? ' bg-base-100':''}`}
          onClick={() => setTheme('dark')}
        >
          <FaMoon />
        </button>
        {/* <input type="radio" name="theme-buttons" className="btn theme-controller join-item" aria-label="Light" value="light" />
      <input type="radio" name="theme-buttons" className="btn theme-controller join-item" aria-label="Dark" value="dark" /> */}
      </div>
    </div>
  )
}

export default SwitchTheme