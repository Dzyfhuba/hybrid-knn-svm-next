import Cleaning from '@/components/Cleaning'
import Normalisasi from '@/components/Normalisasi'
import axios from 'axios'
import dynamic from 'next/dynamic'


const SkelData = dynamic(() => import('@/components/Data'), 
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[40px] w-[126px]"></div>
    )
  }
)

export default async function Home() {
  return (
    <>
      <SkelData />
      <Cleaning />
      {/* <Normalisasi /> */}
      {/* <Perhitungan /> */}
    </>
  )
}
