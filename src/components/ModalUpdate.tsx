import supabase from '@/config/supabase'
import Data from '@/types/data'
import moment from 'moment'
import { SyntheticEvent, useState } from 'react'
import Swal from 'sweetalert2'

type Props = {
  inputId?: string
  data: Data
}

const ModalUpdate = ({ inputId, ...props }: Props) => {
  const [data,setData] = useState(props.data)
  const [formData, setFormData] = useState<Data>(props.data)

  const handleUpdate = async (e: SyntheticEvent) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('dimas_data')
      .update({ 
        date: moment(formData.date).toISOString(), 
        pm10: formData.pm10, 
        pm2_5: formData.pm2_5, 
        so2: formData.so2, 
        co: formData.co, 
        o3: formData.o3, 
        no2: formData.no2, 
        location: formData.location 
      })
      .eq('id', props.data.id!)
      .select()

    Swal.fire({
      title: 'Updated!',
      text: 'Your file has been updated.',
      icon: 'success',
    }).then((result) => {
      if(result.isConfirmed){
        window.location.reload()
      }
    })
  }
  return (
    <form onSubmit={handleUpdate}>
      <div
        className='flex flex-col gap-5'
      >
        <div>
          <label htmlFor=""
            className='m-5'
          >Date</label>
          <input type="date"
            defaultValue={props.data.date}
            name='date'
            id='date'
            onChange={(e) => setFormData({ ...formData, date: String(e.currentTarget.value) })}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs" 
            required
          />
        </div>
        <div>
          <label htmlFor=""
            className='m-5'
          >pm10</label>
          <input type="number"
            defaultValue={props.data.pm10}
            id='pm10'
            onChange={(e) => setFormData({ ...formData, pm10: Number(e.target.value) })}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs" 
            required
          />
        </div>
        <div>
          <label htmlFor=""
            className='m-5'
          >pm2.5</label>
          <input type="number"
            defaultValue={props.data.pm2_5}
            id='pm2'
            onChange={(e) => setFormData({ ...formData, pm2_5: Number(e.currentTarget.value) })}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs" 
            required
          />
        </div>
        <div>
          <label htmlFor=""
            className='m-5'
          >SO2</label>
          <input type="number"
            defaultValue={props.data.so2}
            id='so2'
            onChange={(e) => setFormData({ ...formData, so2: Number(e.currentTarget.value) })}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs" 
            required
          />
        </div>
        <div>
          <label htmlFor=""
            className='m-5'
          >CO</label>
          <input type="number"
            defaultValue={props.data.co}
            id='co'
            onChange={(e) => setFormData({ ...formData, co: Number(e.currentTarget.value) })}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs" 
            required
          />
        </div>
        <div>
          <label htmlFor=""
            className='m-5'
          >O3</label>
          <input type="number"
            defaultValue={props.data.o3}
            id='o3'
            onChange={(e) => setFormData({ ...formData, o3: Number(e.currentTarget.value) })}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs" 
            required
          />
        </div>
        <div>
          <label htmlFor=""
            className='m-5'
          >NO2</label>
          <input type="number"
            defaultValue={props.data.no2}
            id='no2'
            onChange={(e) => setFormData({ ...formData, no2: Number(e.currentTarget.value) })}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs" 
            required
          />
        </div>
        <div>
          <label htmlFor=""
            className='m-5'
          >Location</label>
          <input type="text"
            defaultValue={props.data.location}
            id='location'
            onChange={(e) => setFormData({ ...formData, location: String(e.currentTarget.value) })}
            placeholder="Type here"
            className="input input-bordered w-full max-w-xs" 
            required
          />
        </div>
        <div className='flex flex-row justify-between'>
          <button type='reset'
            className='btn w-[100px] self-start'
          >Reset</button>
          <button type='submit'
            className="btn w-[100px] self-end"
          >Submit</button>
        </div>
      </div>
    </form>
  )
}


export default ModalUpdate