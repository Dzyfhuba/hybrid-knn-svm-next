import React from 'react'

type Props = {}

const Normalisasi = (props: Props) => {
  return (
    <>
      <div className='text-center flex flex-col gap-5 mb-5'>
        <div className="skeleton h-[48px] w-[79px] mx-auto sm: sm:join-horizontal"></div>
        {/* <button className="btn w-max self-center">Button</button> */}
        <div className="skeleton h-[50vh] w-full mx-auto"></div>
      </div>
    </>
  )
}

export default Normalisasi