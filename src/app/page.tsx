// import ExportImport from "@/components/contents/export-import"
import ListOfContent, { DrawerListOfContent } from '@/components/contents/list-of-content'
import Raw from '@/components/contents/raw'
import Reference from '@/components/contents/reference'
import DataSplit from '@/components/contents/data-split'
import TestingKNN from '@/components/contents/testing-knn'
import TrainingSVM from '@/components/contents/training-svm'
import { Content } from 'antd/es/layout/layout'
import Sider from 'antd/es/layout/Sider'

export default function Home() {
  return (
    <>
      <Content
        className="order-2 sm:!order-1 p-3 sm:max-w-screen-lg sm:mx-auto"
      >
        <section id="reference">
          <Reference />
        </section>

        <section id="raw">
          <Raw />
        </section>
        {/* <section id="export-import">
          <ExportImport />
        </section> */}

        {/* <section id="normalization">
          <Normalization />
        </section> */}

        <section id="data-split">
          <DataSplit />
        </section>

        <section id="train">
          <TrainingSVM />
        </section>

        <section id="test">
          <TestingKNN />
        </section>

      </Content>
      <Sider className="order-1 sm:!order-2 w-auto hidden sm:block">
        <ListOfContent />
      </Sider>

      <DrawerListOfContent />
    </>
  )
}


