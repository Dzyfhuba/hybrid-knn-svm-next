import DataSection from '@/components/Data'
import axios from 'axios'
import dynamic from 'next/dynamic'

const getData = async () => {
  const res = await axios.get('http://localhost:3000/api/data')

  return res.data
}
const SkelData = dynamic(() => import('@/components/Data'), 
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[40px] w-[126px]"></div>
    )
  }
)

export default async function Home() {
  const data = await getData()
  return (
    <>
      <SkelData data={data} />
      {/* <Normalisasi />
      <Perhitungan /> */}
    </>
  )
}
