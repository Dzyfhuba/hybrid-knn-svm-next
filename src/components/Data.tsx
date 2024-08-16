'use client'

import supabase from '@/config/supabase'
import { useStoreActions, useStoreState } from '@/state/hooks'
import moment from 'moment'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ModalCreate from './ModalCreate'
import ModalUpdate from './ModalUpdate'
import { useEffect, useState } from 'react'

type Props = {}

const DataSection = (props: Props) => {
  const data = useStoreState((state) => state.data)
  const loadingData = useStoreState((state) => state.isLoading)
  const { setData, getData } = useStoreActions((actions) => actions )
  const ReactSwal = withReactContent(Swal)

  const handleDelete = (id: number) => {
    ReactSwal.fire({
      text: 'ARE U SURE??????',
      showConfirmButton: true,
      showCancelButton: true,
      showCloseButton: true,
      title: 'Delete Data',
      allowOutsideClick: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then( async (result) => {
      if(result.isConfirmed){
        const {} = await supabase
          .from('dimas_data')
          .update({ deleted_at : moment().toISOString() })
          .eq('id', id)
          .select()
        ReactSwal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success'
        }).then(() => {
          if (result.isConfirmed){
            setData(data.filter(e => e.id !== id))
          }
        })
      }
    })
  }

  const handleUpdate = (id :number) => {
    const selected = data.filter(e => e.id === id)[0]
    ReactSwal.fire({
      // title: 'Update Data',
      showConfirmButton: false,
      html: (
        <ModalUpdate data={selected}  />
      )
    })
  }

  useEffect(() => {
    getData()
  }, [])
  

  return (
    <div className='flex flex-col mb-5 h-full max-h-screen'
      id='datamentah'
    >
      {/* <div className="skeleton h-[48px] w-[236px] mx-auto sm: sm:join-horizontal"></div> */}
     
     <div className='flex justify-between items-center p-4 mb-4 border-b-2 border-base-100'>
        <b className='text-lg'>Data Kualitas Udara</b>
        <div>
        {/* <div className="join sm:join-horizontal"> */}
          {/* <button className="btn btn-neutral join-item">Import</button> */}
          <ModalCreate inputId='createmodal'>Add Data</ModalCreate>
          {/* <button className="btn btn-neutral join-item">Export</button> */}
      </div>
     </div>
      <div className='flex flex-col gap-5 overflow-y-auto flex-1 text-center'>
        {loadingData ? (
              <div className="h-full w-full flex item-center justify-center">
                <span className="loading loading-dots loading-lg"></span>
              </div>
            ) :(

              <table id='data'>
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
              <th>Extras</th>
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
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
                <td><div className="join join-vertical lg:join-horizontal">
                  {/* <ModalUpdate data={data}
                    inputId='updatemodal'
                  >Update</ModalUpdate> */}
                  <button onClick={() => handleUpdate(item.id!)}
                    className='btn join-item'
                  >Update</button>
                  <button onClick={() => handleDelete(item.id!)}
                    className='btn join-item'
                  >Delete</button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
          )}
      </div>
        
      {/* <div className="skeleton h-[50vh] w-full mx-auto"></div> */}
    </div>

  )
}

export default DataSection