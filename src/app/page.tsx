import { Content } from "antd/es/layout/layout"

export default function Home() {
  return (
    <>
      <aside
        className="!w-full sm:!w-48 order-first"
      >
      </aside>
      <Content
        className="order-2 sm:!order-1"
      >
        content
      </Content>
      <aside
        className="order-1 sm:!order-2"
      >
        aside
      </aside>
    </>
  )
}
