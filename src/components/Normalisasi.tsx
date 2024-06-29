'use client'

import db from '@/helpers/idb'
import Data from '@/types/data'
import * as dfd from 'danfojs'
import { useEffect, useState } from 'react'

type Props = {}

const Normalisasi = (props: Props) => {
  const [minMax, setMinMax] = useState<Data[]>([])
  
  const handleNormal = async () => {
    const data = await db.dataClean.toArray()
    const df =  new dfd.DataFrame(data)
    const sf = df.iloc({ columns: [2,3,4,5,6,7] })
    let scaler = new dfd.MinMaxScaler()

    scaler.fit(sf)

    const dfEnc = scaler.transform(sf)
    const jsonNorm = dfd.toJSON(dfEnc) as Data[]
    
    const jsonMapped = jsonNorm.map((item, idx) => ({
      ...item,
      id: data[idx].id
    }))

    db.dataNormalized.bulkPut(jsonMapped)
    
    setMinMax(jsonMapped)
  }

  useEffect(() => {
    (async () => {
      const data = await db.dataNormalized.toArray()
      setMinMax(data)
    })()  
  }, [])
  

  return (
    <div className='text-center flex flex-col gap-5 mb-5'
      id='normalisasidata'
    >
      <div className="text-center flex flex-col gap-5 mb-5">
        <button onClick={() => handleNormal()}
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg w-max self-center"
        >Normalization</button>
      </div>
      <div className='flex flex-col gap-5 overflow-y-auto h-[500px]'>
        <table id = 'cleanData'>
          <thead>
            <tr>
              <th>ID</th>
              <th>PM10</th>
              <th>PM2.5</th>
              <th>SO2</th>
              <th>CO</th>
              <th>O3</th>
              <th>NO2</th>
            </tr>
          </thead>
          <tbody>
            {minMax.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.pm10}</td>
                <td>{item.pm2_5}</td>
                <td>{item.so2}</td>
                <td>{item.co}</td>
                <td>{item.o3}</td>
                <td>{item.no2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Normalisasi