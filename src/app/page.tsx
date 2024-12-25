import ExportImport from "@/components/contents/export-import"
import ListOfContent from "@/components/contents/list-of-content"
import Normalization from "@/components/contents/normalization"
import Raw from "@/components/contents/raw"
import { Content } from "antd/es/layout/layout"

export default function Home() {
  return (
    <>
      <Content
        className="order-2 sm:!order-1"
      >
        <section id="raw">
          <Raw />
        </section>
        <section id="export-import">
          <ExportImport />
        </section>

        <section id="normalization">
          <Normalization />
        </section>

        <section id="train">

        </section>
        <section id="test">

        </section>
      </Content>
      <Content className="order-1 sm:!order-2 ">
        <aside className="w-full sm:w-100 sticky top-0 ">
          <ListOfContent />
        </aside>
      </Content>

    </>
  )
}


