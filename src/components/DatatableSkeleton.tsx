import React from 'react'

type Props = {}

const DatatableSkeleton = (props: Props) => {
  return (

    <div className='flex flex-col gap-px'>
      {
        Array.from({ length:10 }).map((_,id)=>(
          <div key={id}
            className="skeleton w-100 h-[50px] "
          ></div>
        ))   
      }
    

    </div>
    
      
  )
}

export default DatatableSkeleton