import React from 'react'
import dynamic from 'next/dynamic'

type Props = {}


const Footer = (props: Props) => {
  const SkelST = dynamic(() => import('@/components/SwitchTheme'), 
    {
      ssr: false,
      loading: () => (
        <div className="skeleton h-[40px] w-[126px]"></div>
      )
    }
  )
  return (
    <>
      <footer className='p-5 flex w-full justify-end'>
        <SkelST />
      </footer>
    </>
  )
}

export default Footer