'use client';

import db from '@/helpers/idb';
import {useStoreActions} from '@/state/hooks';
import Data from '@/types/data';
import * as dfd from 'danfojs';
import {useEffect, useState} from 'react';
import Swal from 'sweetalert2';

type Props = {};

const Normalisasi = (props: Props) => {
  const {setIsDataNormalize} = useStoreActions((action) => action);
  const [minMax, setMinMax] = useState<Data[]>([]);

  const handleNormal = async () => {
    Swal.fire({
      title: 'Are u Sure?',
      text: 'This thing will normalize the data',
    }).then(async ({isConfirmed}) => {
      if (isConfirmed) {
        const data = await db.dataClean.toArray();
        const df = new dfd.DataFrame(data);
        const sf = df.iloc({columns: [2, 3, 4, 5, 6, 7]});
        let scaler = new dfd.MinMaxScaler();

        scaler.fit(sf);

        const dfEnc = scaler.transform(sf);
        const jsonNorm = dfd.toJSON(dfEnc) as Data[];

        const jsonMapped = jsonNorm.map((item, idx) => ({
          ...item,
          id: data[idx].id,
        }));

        db.dataNormalized.bulkPut(jsonMapped);

        setMinMax(jsonMapped);
        setIsDataNormalize(true);
      }
    });
  };

  useEffect(() => {
    (async () => {
      const data = await db.dataNormalized.toArray();
      setMinMax(data);
      data.length && setIsDataNormalize(true);
    })();
  }, []);

  return (
    <div
      className="text-center flex flex-col mb-5 h-full max-h-screen relative"
      id="normalisasidata"
    >
      <div className="justify-between items-center flex flex-row gap-5 p-4 border-b-2 mb-4 border-base-100">
        <b className="text-lg">Normalisasi Data</b>
        <button
          onClick={() => handleNormal()}
          // className="btn btn-neutral btn-xs sm:btn-sm md:btn-md lg:btn-lg w-max self-center"
          className={`btn w-max self-center px-6 ${
            minMax.length ? 'btn-neutral' : 'btn-warning'
          } `}
        >
          Normalization
        </button>
      </div>
      <div className="flex flex-col gap-5 overflow-y-auto flex-1">
          {minMax.length ? null :
            <div className='absolute top-1/2 w-full gap-5 content-center'>
              <p>No data</p>
            </div>
          } 
        <table id="cleanData">
          <thead className='sticky top-0 bg-base-200'>
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
            {minMax.map((item) => (
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
  );
};

export default Normalisasi;
