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
      {/* <Normalisasi />
      <Perhitungan /> */}
    </>
  )
}
