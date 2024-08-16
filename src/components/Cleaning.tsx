'use client'

import db from '@/helpers/idb'
import { useStoreActions, useStoreState } from '@/state/hooks'
import Data from '@/types/data'
import * as dfd from 'danfojs'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

type Props = {}

const Cleaning = (props: Props) => {
  const data = useStoreState((state) => state.data)
  const {setIsDataCleaned} = useStoreActions(action => action)
  const [cleanData, setCleanData] = useState<Data[]>([])
  const df = new dfd.DataFrame(data)

  const handleMean = () => {
    Swal.fire({
      title: 'Are u Sure?',
      text: 'This thing will calculate mean',
    }).then(({ isConfirmed }) => {
      if(isConfirmed) {
        const meanData = df.fillNa([
          df['pm10'].mean(), 
          df['pm2_5'].mean(), 
          df['so2'].mean(), 
          df['co'].mean(),  
          df['o3'].mean(), 
          df['no2'].mean()], 
        { columns: ['pm10', 'pm2_5', 'so2', 'co', 'o3', 'no2'] })
        // console.log(meanData)
        const jsonData = dfd.toJSON(meanData) as Data[]
        db.dataClean.bulkAdd(jsonData)
        setCleanData(jsonData)
        setIsDataCleaned(true)
      }
    })
  }

  useEffect(() => {
    (async () => {
      const data = await db.dataClean.toArray()
      setCleanData(data)
      data.length && setIsDataCleaned(true)
    })()
  }, [])

  return (
    <div className='text-center flex flex-col gap-5 mb-5 h-full max-h-screen relative'
      id='cleaning'
    >
      {/* <div className="skeleton h-[48px] w-[79px] mx-auto sm: sm:join-horizontal"></div> */}
      {/* <div className="skeleton h-[50vh] w-full mx-auto"></div> */}

        <div className='justify-between items-center flex flex-row gap-5 p-4  mb-4 border-b-2 border-base-100'>
          <b className='text-lg'>Pembersihan Data</b>
          <button type='submit'
            className={`btn w-max self-center px-6 ${cleanData.length ? "btn-neutral" : "btn-warning"} `}
            onClick={() => handleMean()}
          >Clean</button>
        </div>
        <div className='flex flex-1 flex-col gap-5 overflow-y-auto'>
          {cleanData.length ? null :
            <div className='absolute top-1/2 w-full gap-5 content-center'>
              <p>No data</p>
            </div>
          } 
          <table id = 'cleanData'>
            <thead className='sticky top-0 bg-base-200'>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>PM10</th>
                <th>PM2.5</th>
                <th>SO2</th>
                <th>CO</th>
                <th>O3</th>
                <th>NO2</th>
                <th>Location</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {cleanData.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.date}</td>
                  <td>{item.pm10}</td>
                  <td>{item.pm2_5}</td>
                  <td>{item.so2}</td>
                  <td>{item.co}</td>
                  <td>{item.o3}</td>
                  <td>{item.no2}</td>
                  <td>{item.location}</td>
                  <td>{item.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  )
}

export default Cleaning