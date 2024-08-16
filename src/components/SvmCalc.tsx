'use client';

import db from '@/helpers/idb';
import splitData from '@/helpers/splitData';
import Data from '@/types/data';
import SplitData from '@/types/splitData';
import {useState} from 'react';
import Swal from 'sweetalert2';

type Props = {};

const SvmCalc = (props: Props) => {
  const [splitD, setSplitD] = useState<SplitData>();

  const handleSplit = async () => {
    Swal.fire({
      title: 'Are u Sure?',
      text: 'This thing will split data',
    }).then(async ({isConfirmed}) => {
      if (isConfirmed) {
        const data = await db.dataNormalized.toArray();
        const splitedData = splitData(data);
        setSplitD(splitedData);
      }
    });
  };

  const handleCalc = () => {};

  return (
    <div className='flex flex-col mb-5 h-full max-h-screen'>
      <div className="flex justify-between items-center p-4 mb-4 border-b-2 border-base-100">
        <b className="text-lg">Perhitungan SVM</b>
        <div>
          <div className="join lg:join-horizontal">
            <button
              className="btn btn-warning join-item"
              onClick={() => handleSplit()}
            >
              Split Data
            </button>
            <button
              className="btn btn-warning join-item"
              onClick={() => handleCalc()}
            >
              Calculation
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default SvmCalc;
