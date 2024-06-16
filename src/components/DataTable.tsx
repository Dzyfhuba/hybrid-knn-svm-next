'use client'
import { useEffect, useState } from 'react'
import supabase from '../config/supabase'
import { Database } from '@/types/supabase'
import Data from '@/types/data'
import DataTableLibrary from 'datatables.net-dt'
import 'datatables.net-dt/css/dataTables.dataTables.min.css'

const DataTable = () => {
  const [fetchError, setFetchError] = useState('')
  const [dataTable, setDataTable] = useState<Data[]>()

  useEffect( () => {
    const fetchDataTable = async () => {
      const { data, error } = await supabase
        .from('dimas_data')
        .select()

      if (data) {
        setFetchError('')
        setDataTable(data)
        console.log(data)
        new DataTableLibrary('#data', {
          data,
          columns: [
            { data: 'id' },
            { data: 'date' },
            { data: 'pm10' },
            { data: 'pm2_5' },
            { data: 'so2' },
            { data: 'co' },
            { data: 'o3' },
            { data: 'no2' },
            { data: 'location' }
          ]
        })
      }
    }

    fetchDataTable()
    
    return () => {

    }
  }, [])
  

  return (
    <div>
      <h1>cek</h1>
      {fetchError && (<p>{fetchError}</p>)}
      {dataTable && (
        <div>
          {/* {dataTable.map(item => (
            <p key={item.id}>{item.location}</p>
          ))} */}
          <table id='data'>
            <thead>
              <tr>
                <th>id</th>
                <th>date</th>
                <th>pm10</th>
                <th>pm2.5</th>
                <th>so2</th>
                <th>co</th>
                <th>o3</th>
                <th>no2</th>
                <th>location</th>
              </tr>
            </thead>
          </table>
        </div>
      )}
    </div>
  )
}

export default DataTable
