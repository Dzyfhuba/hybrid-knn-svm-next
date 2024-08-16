'use client';
import React, {useMemo} from 'react';
import dynamic from 'next/dynamic';
import Steps from './Steps';
import Link from 'next/link';
import {useStoreState} from '@/state/hooks';
import stepsDataProcess from '@/helpers/constants/stepsDataProcess';
import {FaArrowRight} from 'react-icons/fa';

type Props = {};

const SkelST = dynamic(() => import('@/components/SwitchTheme'), {
  ssr: false,
  loading: () => <div className="skeleton h-[40px] w-[126px]"></div>,
});
const Footer = (props: Props) => {
  const dataActiveScrollSection = useStoreState(
    (state) => state.activeScrollSection
  );

  //@ts-ignore
  const steps = stepsDataProcess[dataActiveScrollSection];
  const recentSteps = steps ? steps.order : null;

  const next = useMemo(() => {
    if (recentSteps) {
      for (const key in stepsDataProcess) {
        //@ts-ignore
        if (stepsDataProcess[key].order == recentSteps + 1) {
          //@ts-ignore
          return stepsDataProcess[key].idName;
        }
      }
    }

    return 'datamentah';
  }, [dataActiveScrollSection]);

  return (
    <>
      <footer className="p-5 flex w-full justify-between items-center fixed bottom-0 z-30 bg-base-100 gap-2">
        <Steps />
        <div className="flex gap-5 items-center">
          <div className='max-sm:hidden'>
            <SkelST />
          </div>
          <Link href={'#' + next}>
            <button className="btn btn-primary">
              Next
              <FaArrowRight className='max-sm:hidden'/>
            </button>
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
