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
    if(!formData.location?.length) return

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
      <button 
      className="btn btn-warning w-max self-center px-6"
      // className="btn btn-neutral join-item"
        // @ts-expect-error
        onClick={() => document.getElementById(inputId || '')?.showModal()}
      >{props.children}</button>
      <dialog id={inputId}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box">
          <form method='dialog' className='border-b border-b-base-200 flex justify-between items-center pb-2 mb-5'>
                  <h1 className='text-xl'>Insert Data</h1>
                  {/* <button className='btn'>✖</button> */}
                </form>
          <form method="dialog"
            onSubmit={handleSubmit}
          >
            <div className='flex flex-col gap-5'>
              <div className='flex max-sm:flex-col justify-between sm:items-center'>
                <label htmlFor=""
                  className=''
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
              <div className='flex max-sm:flex-col justify-between sm:items-center'>
                <label htmlFor=""
                  className=''
                >pm10</label>
                <input type="number"
                  id='pm10'
                  onChange={(e) => setFormData({ ...formData, pm10: Number(e.target.value) })}
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs" 
                  required
                />
              </div>
              <div className='flex max-sm:flex-col justify-between sm:items-center'>
                <label htmlFor=""
                  className=''
                >pm2.5</label>
                <input type="number"
                  id='pm2'
                  onChange={(e) => setFormData({ ...formData, pm2_5: Number(e.currentTarget.value) })}
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs" 
                  required
                />
              </div>
              <div className='flex max-sm:flex-col justify-between sm:items-center'>
                <label htmlFor=""
                  className=''
                >SO2</label>
                <input type="number"
                  id='so2'
                  onChange={(e) => setFormData({ ...formData, so2: Number(e.currentTarget.value) })}
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs" 
                  required
                />
              </div>
              <div className='flex max-sm:flex-col justify-between sm:items-center'>
                <label htmlFor=""
                  className=''
                >CO</label>
                <input type="number"
                  id='co'
                  onChange={(e) => setFormData({ ...formData, co: Number(e.currentTarget.value) })}
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs" 
                  required
                />
              </div>
              <div className='flex max-sm:flex-col justify-between sm:items-center'>
                <label htmlFor=""
                  className=''
                >O3</label>
                <input type="number"
                  id='o3'
                  onChange={(e) => setFormData({ ...formData, o3: Number(e.currentTarget.value) })}
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs" 
                  required
                />
              </div>
              <div className='flex max-sm:flex-col justify-between sm:items-center'>
                <label htmlFor=""
                  className=''
                >NO2</label>
                <input type="number"
                  id='no2'
                  onChange={(e) => setFormData({ ...formData, no2: Number(e.currentTarget.value) })}
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs" 
                  required
                />
              </div>
              <div className='flex max-sm:flex-col justify-between sm:items-center'>
                <label htmlFor=""
                  className=''
                >Location</label>
                <input type="text"
                  id='location'
                  onChange={(e) => setFormData({ ...formData, location: String(e.currentTarget.value) })}
                  placeholder="Type here"
                  className="input input-bordered w-full max-w-xs" 
                  required
                />
              </div>
              <div className='flex flex-row justify-between border-t border-t-base-200 pt-6'>
                <button type='reset'
                  className='btn btn-ghost self-start'
                >Reset</button>
                <button type='submit'
                  className="btn btn-warning self-end"
                >Submit</button>
              </div>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  )
}

export default ModalCreate