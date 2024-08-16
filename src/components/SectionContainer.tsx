'use client';
import {useStoreActions} from '@/state/hooks';
import {ReactElement, useEffect} from 'react';
import {useIntersectionObserver} from 'usehooks-ts';

const SectionContainer = ({
  children,
  name,
  setIntersection,
}: {
  children?: ReactElement;
  name?: string;
  setIntersection?(value: string): void;
}) => {
  const {ref, isIntersecting} = useIntersectionObserver({threshold: 0});
  const {setActiveScrollSection} = useStoreActions((actions) => actions);

  useEffect(() => {
    isIntersecting && setActiveScrollSection(name ?? '');
    // isIntersecting && console.log(name);
  }, [isIntersecting]);
  // console.log(name);

  return (
    <div
      id={name}
      className="h-screen w-full p-7 flex flex-col justify-center relative"
    >
      <div className="absolute pointer-events-none top-1/3" ref={ref}></div>
      <div className="h-4/5 bg-base-200 rounded-xl shadow-2xl overflow-hidden">{children}</div>
    </div>
  );
};

export default SectionContainer;
