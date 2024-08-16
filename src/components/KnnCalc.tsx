import React from 'react'

type Props = {}

export default function KnnCalc({}: Props) {
  return (
    <div className='flex flex-col mb-5 h-full max-h-screen'>
      <div className="flex justify-between items-center p-4 mb-4 border-b-2 border-base-100">
        <b className="text-lg">Perhitungan KNN</b>
        <div>
          <div className="join lg:join-horizontal">
            <button
              className="btn btn-warning join-item"
            //   onClick={() => handleSplit()}
            >
              Split Data
            </button>
            {/* <button
              className="btn btn-warning join-item"
            //   onClick={() => handleCalc()}
            >
              Calculation
            </button> */}
          </div>
        </div>
      </div>
      <div></div>
    </div>
  )
}