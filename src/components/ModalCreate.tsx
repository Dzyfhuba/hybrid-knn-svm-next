'use client'

import supabase from '@/config/supabase'
import { today } from '@/helpers/date'
import Data from '@/types/data'
import moment from 'moment'
import { ReactNode, SyntheticEvent, useState } from 'react'

type Props = {
  inputId?: string
  children: ReactNode
}

const ModalCreate = ( { inputId, ...props } : Props) => {

  const [formData, setFormData] = useState<Data>({
    date: today(),
    pm10: 0,
    pm2_5: 0,
    so2: 0,
    co: 0,
    o3: 0,
    no2: 0,
    location: ''
  })

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    console.log(formData)
    const { data, error } = await supabase
      .from('dimas_data')
      .insert({ 
        date: moment(formData.date).toISOString(), 
        pm10: formData.pm10, 
        pm2_5: formData.pm2_5, 
        so2: formData.so2, 
        co: formData.co, 
        o3: formData.o3, 
        no2: formData.no2, 
        location: formData.location 
      })
      .select()
    console.log(data)
  }

  return (
    <>
      <button className="btn join-item"
        // @ts-expect-error
        onClick={() => document.getElementById(inputId || '')?.showModal()}
      >{props.children}</button>
      <dialog id={inputId}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form method="dialog"
            onSubmit={handleSubmit}
          >
            <h1 className='mb-5'>Insert Data</h1>
            <div className='flex flex-col gap-5'>
              <div>
                <label htmlFor=""
                  className='m-5'
                >Date</label>
                <input type="date"
                  defaultValue={today()}
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
                  id='location'
                  onChange={(e) => setFormData({ ...formData, location: String(e.currentTarget.value) })}
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs" 
                  required
                />
              </div>
              <div className='flex flex-row justify-between'>
                <button type='reset'
                  className='btn w-[80px] self-start'
                >Reset</button>
                <button type='submit'
                  className="btn w-[80px] self-end"
                >Submit</button>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </>
  )
}

export default ModalCreate