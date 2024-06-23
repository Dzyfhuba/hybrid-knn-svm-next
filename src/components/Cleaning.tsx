'use client'

import db from '@/helpers/idb'
import { useStoreState } from '@/state/hooks'
import Data from '@/types/data'
import * as dfd from 'danfojs'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'

type Props = {}

const Cleaning = (props: Props) => {
  const data = useStoreState((state) => state.data)
  const [cleanData, setCleanData] = useState<Data[]>([])
  const df = new dfd.DataFrame(data)

  const handleMean = () => {
    Swal.fire({
      title: 'Are u SURE?????',
      text: 'this thing will calculate mean',
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
      }
    })
  }

  useEffect(() => {
    (async () => {
      const data = await db.dataClean.toArray()
      setCleanData(data)
    })()
  }, [])

  return (
    <div className='text-center flex flex-col gap-5 mb-5'id='cleaning'>
      {/* <div className="skeleton h-[48px] w-[79px] mx-auto sm: sm:join-horizontal"></div> */}
      {/* <div className="skeleton h-[50vh] w-full mx-auto"></div> */}
      <div>
        <div className='justify-center flex flex-row gap-5 mb-5'>
          <button type='submit'
            className="btn w-max self-center"
            onClick={() => handleMean()}
          >Clean</button>
        </div>
        <div className='flex flex-col gap-5 overflow-y-auto h-[500px]'>
          <table id = 'cleanData'>
            <thead>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Cleaning