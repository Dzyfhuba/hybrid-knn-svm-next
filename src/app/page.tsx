import Cleaning from '@/components/Cleaning'
import Client from '@/components/Client'
import Normalisasi from '@/components/Normalisasi'
import dynamic from 'next/dynamic'
import DatatableSkeleton from '@/components/DatatableSkeleton'

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
      <Client>
        <SkelData />
        <Cleaning />
        <Normalisasi />

        {/* <Perhitungan /> */}

        <section id='normalisasidata'>
          <h1 className='text-center text-xl font-medium mb-3' >NORMALISASI DATA</h1>
          
          <DatatableSkeleton />          
          
        </section>

             
      </Client>
    </>
  )
}
