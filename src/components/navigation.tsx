import { Header } from 'antd/es/layout/layout'
import Link from 'next/link'

const Navigation = () => {
  return (
    <Header className="h-14 shadow-md flex items-center z-10">
      <nav>
        <Link href={'/'}>
          <h1 className="text-2xl font-bold dark:text-white">
            {process.env.NEXT_PUBLIC_APP_TITLE}
          </h1>
        </Link>
      </nav>
    </Header>
  )
}

export default Navigation
