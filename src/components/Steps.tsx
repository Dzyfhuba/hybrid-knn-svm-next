'use client'

import db from '@/helpers/idb';
import { useStoreActions, useStoreState } from '@/state/hooks';
import React, { useEffect, useState } from 'react';
import {FaCircleCheck} from 'react-icons/fa6';

type StepsProps = {};

function StepItem({
  name,
  active,
  success,
}: {
  name: string;
  active: boolean;
  success: boolean;
}) {
  return (
    <li className="gap-2">
      <div
        className={`h-5 w-5 rounded-full flex items-center justify-center border overflow-hidden ${
          active ? 'border-primary' : 'border'
        }`}
      >
        {success ? <FaCircleCheck size={12} color="#00DD00" /> : null}
      </div>
      <span className={active ? 'text-primary' : ''}>{name}</span>
    </li>
  );
}

export default function Steps({}: StepsProps) {
  const dataActiveScrollSection = useStoreState((state) => state.activeScrollSection)
  const data = useStoreState((state) => state.data)
  const isDataCleaned = useStoreState((state) => state.isDataCleaned)
  
  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <StepItem active={dataActiveScrollSection == 'datamentah'} name="Insert Data" success={!!data.length} />
        <StepItem active={dataActiveScrollSection == 'cleaning'}  name="Clean Data" success={isDataCleaned} />
        <StepItem active={dataActiveScrollSection == 'normalisasidata'} name="Normalization" success={false} />
        <StepItem active={dataActiveScrollSection == 'svm'} name="SVM" success={false} />
        <StepItem active={dataActiveScrollSection == 'knn'} name="KNN" success={false} />
        <StepItem active={dataActiveScrollSection == 'confusingmatrix'} name="Matrix" success={false} />
      </ul>
    </div>
  );
}
