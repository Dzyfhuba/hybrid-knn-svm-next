import Data from '@/components/Data'
import Normalisasi from '@/components/Normalisasi'
import Perhitungan from '@/components/Perhitungan'
// import dynamic from 'next/dynamic'

// const SkelData = dynamic(() => import('@/components/Data'), 
//   {
//     ssr: false,
//     loading: () => (
//       <div className="skeleton h-[40px] w-[126px]"></div>
//     )
//   }
// )

export default function Home() {
  return (
    <>
      <Data />
      <Normalisasi />
      <Perhitungan />
    </>
  )
}
