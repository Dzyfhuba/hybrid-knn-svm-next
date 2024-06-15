// import dynamic from 'next/dynamic'

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

// const SwitchTheme = dynamic(() => import('@/components/SwitchTheme'), 
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
      <Navbar />
      <Footer />
    </>
  )
}
