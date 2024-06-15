import React from 'react'

type Props = {}

const Data = (props: Props) => {
  return (
    <>
      <div className='text-center flex flex-col gap-5 mb-5'>
        <div className="skeleton h-[48px] w-[236px] mx-auto sm: sm:join-horizontal"></div>
        {/* <div className="join join-vertical sm:join-horizontal">
          <button className="btn join-item">Button</button>
          <button className="btn join-item">Button</button>
          <button className="btn join-item">Button</button>
        </div> */}
        <div className="skeleton h-[50vh] w-full mx-auto"></div>
      </div>
    </>
  )
}

export default Data