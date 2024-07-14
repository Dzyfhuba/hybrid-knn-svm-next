'use client'

import db from '@/helpers/idb'
import splitData from '@/helpers/splitData'
import Data from '@/types/data'
import SplitData from '@/types/splitData'
import { useState } from 'react'
import Swal from 'sweetalert2'
 
type Props = {}

const SvmCalc = (props : Props) => {
  const [splitD, setSplitD] = useState<SplitData>()
  
  const handleSplit = async () => {
    Swal.fire({
      title: 'Are u SURE?????',
      text: 'this thing will SPLIT THE FREAKING WORLD',
    }).then(async ({ isConfirmed })  => {
      if(isConfirmed) {
        const data = await db.dataNormalized.toArray()
        const splitedData = splitData(data)
        setSplitD(splitedData)
      }
    })
  }

  const handleCalc = () => {

  }

  return (
    <div className='justify-center flex flex-row gap-5 mb-5 m-auto'>
      <div className="join join-vertical lg:join-horizontal">
        <button className="btn join-item"
          onClick={() => handleSplit()}
        >Split Data</button>
        <button className="btn join-item"
          onClick={() => handleCalc()}
        >Calculation</button>
      </div>
    </div>
  )
}

export default SvmCalc