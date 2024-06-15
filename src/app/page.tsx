import dynamic from 'next/dynamic'

const SwitchTheme = dynamic(() => import('@/components/SwitchTheme'), 
  {
    ssr: false,
    loading: () => (
      <div className="skeleton h-[40px] w-[126px]"></div>
    )
  }
)

export default function Home() {
  return (
    <main className="">
      <div className="navbar bg-white-100">
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
          </button>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
        <div className="flex-none">
          <SwitchTheme />
        </div>
      </div>
    </main>
  )
}
