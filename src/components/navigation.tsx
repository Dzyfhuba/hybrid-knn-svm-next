import { Header } from "antd/es/layout/layout"

const Navigation = () => {
  return (
    <Header
      className="h-14 shadow-md flex items-center"
    >
      <nav>
        <h1
          className="text-2xl font-bold text-white"
        >
          {process.env.NEXT_PUBLIC_APP_TITLE}
        </h1>
      </nav>
    </Header>
  )
}

export default Navigation