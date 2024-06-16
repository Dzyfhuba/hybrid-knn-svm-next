'use client'
import supabase from '@/config/supabase'
import { today } from '@/helpers/date'
import Data from '@/types/data'
import moment from 'moment'
import { useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import ModalCreate from './ModalCreate'
import ModalUpdate from './ModalUpdate'

type Props = {
  data: Data[]
}

const DataSection = (props: Props) => {
  const [data, setData] = useState(props.data)
  const ReactSwal = withReactContent(Swal)

  // const [formData, setFormData] = useState<Data>({
  //   date: today(),
  //   pm10: 0,
  //   pm2_5: 0,
  //   so2: 0,
  //   co: 0,
  //   o3: 0,
  //   no2: 0,
  //   location: ''
  // })

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
      title: 'Update Data',
      showConfirmButton: false,
      html: (
        <ModalUpdate data={selected}  />
      )
    })
  }

  return (
    <>
      <div className='text-center flex flex-col gap-5 mb-5'>
        {/* <div className="skeleton h-[48px] w-[236px] mx-auto sm: sm:join-horizontal"></div> */}
        <div className="join join-vertical sm:join-horizontal mx-auto">
          <button className="btn join-item">Import</button>
          <ModalCreate  inputId='createmodal'>Add Data</ModalCreate>
          <button className="btn join-item">Export</button>
        </div>

        <table id='data'>
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
        
        <div className="skeleton h-[50vh] w-full mx-auto"></div>
      </div>
    </>
  )
}

export default DataSection