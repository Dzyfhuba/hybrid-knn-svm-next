'use client'

import {
  Button,
  Divider,
  Modal,
  Table,
  TableProps,
  Form,
  InputNumber,
} from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import qs from 'qs'
import { useStoreActions, useStoreState } from '@/state/hooks'
import KNN from '@/models/knn'
import kualitas from '@/helpers/kualitas'
import axios from 'axios'
import TextPrimary from '../text-primary'
import ClassificationReport from '@/models/classification-report'

interface DataType {
  id: number
  pm10: number
  pm2_5: number
  so2: number
  co: number
  o3: number
  no2: number
  kualitas: string
  actual?: string
  prediction?: string
}

interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: SorterResult<DataType>['field']
  sortOrder?: SorterResult<DataType>['order']
  filters?: Record<string, FilterValue | null>
}

type ColumnsType<T extends object = object> = TableProps<T>['columns']
type TablePaginationConfig = Exclude<
  TableProps<DataType>['pagination'],
  boolean
>

const PengujianKNN = () => {
  const [modal, modalContext] = Modal.useModal()
  const model = useStoreState((state) => state.model)
  const putModel = useStoreActions((actions) => actions.putModel)
  const predictionKnn = useStoreState((state) => state.predictionKnn)
  const reference = model.reference
  const [form] = Form.useForm()

  const [data, setData] = useState<DataType[]>([])
  const [report, setReport] = useState<
    {
      label: string
      precision: string
      recall: string
      f1: string
      support: string
    }[]
  >()
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [loadingTesting, setLoadingTesting] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })

  const selfUrl =
    typeof window === 'undefined'
      ? ''
      : `${window.location.protocol}//${window.location.host}`

  const parseParams = (params: TableParams) => ({
    ...params.pagination,
    orderBy: params.sortField,
    order: params.sortOrder === 'ascend' ? 'asc' : 'desc',
    ...params.filters,
  })

  const fetchData = async () => {
    if (!reference) return
    setLoading(true)

    try {
      let res = await fetch(
        `${selfUrl}/api/data-prediction-knn?${qs.stringify({
          ...parseParams(tableParams),
          reference,
        })}`
      ).then((res) => res.json())

      if (!res.total) {
        res = await fetch(
          `${selfUrl}/api/data-test?${qs.stringify({
            ...parseParams(tableParams),
            reference,
          })}`
        ).then((res) => res.json())
      }

      setData(res.data)
      setLoading(false)
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: res.total,
        },
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortOrder,
    tableParams.sortField,
    JSON.stringify(tableParams.filters),
    model.reference,
  ])

  useEffect(() => {
    if (model?.knn_report && Array.isArray(model?.knn_report)) {
      //@ts-expect-error difference type
      setReport(model.knn_report)
    }
  }, [model])

  const handleProcessTesting = async () => {
    if (!reference) return
    let dataTrain = predictionKnn
    setLoadingTesting(true)

    if (!dataTrain.length) {
      dataTrain = await axios
        .get(
          `/api/data-prediction-svm/all${
            reference ? `?reference=${reference}` : ''
          }`
        )
        .then((res) => res.data.data)
    }

    if (!dataTrain.length) {
      modal.error({
        title: 'Pengujian Gagal',
        content:
          'Data latih baru tidak tersedia, lakukan pelatihan (SVM) terlebih dahulu!',
      })

      setLoadingTesting(false)
      return
    }

    const test = await axios
      .get(`/api/data-test/all${reference ? `?reference=${reference}` : ''}`)
      .then((res) => res.data.data as DataType[])

    const cleanTest = test.filter((item) =>
      item.pm10 !== null &&
      item.pm2_5 !== null &&
      item.so2 !== null &&
      item.co !== null &&
      item.o3 !== null &&
      item.no2 !== null
        ? true
        : false
    )

    const k = form.getFieldValue('k_value') as number
    const knn = new KNN(k)

    const X = dataTrain.map((item) => [
      item.pm10,
      item.pm2_5,
      item.so2,
      item.co,
      item.o3,
      item.no2,
    ]) as number[][]
    const y = dataTrain.map((item) => kualitas.transform(item.prediction!))

    console.log('Training KNN...')
    knn.fit(X, y)
    console.log('Training done')

    const XTest = cleanTest.map((item) => [
      item.pm10,
      item.pm2_5,
      item.so2,
      item.co,
      item.o3,
      item.no2,
    ])
    const yTest = cleanTest.map((item) => kualitas.transform(item.kualitas!))

    const prediction = knn.predict(XTest)
    console.log('Prediction:', prediction)

    // console.log('Distance : ', knn.getDistanceRecords())
    // console.log('K Indices : ', knn.getKIndicesRecords())
    // console.log('K Nearest : ', knn.getKNearestLabelsRecords())
    // console.log('Records : ', knn.getMostCommonRecords())

    const report = new ClassificationReport(yTest, prediction)

    console.log(report.printReport())
    setReport(
      report.report().map((item) => ({
        ...item,
        label: !isNaN(parseInt(item.label))
          ? kualitas.detransform(parseInt(item.label))
          : item.label,
      }))
    )

    console.log('Saving model...')
    putModel({
      ...model,
      knn_report: report.report(),
      model: {
        //@ts-expect-error the model type is json but get object
        ...model?.model,
        knn: { distance: knn.getDistanceRecords(), k },
      },
    })

    const dataWithPrediction = cleanTest.map((item, index) => ({
      ...item,
      actual: item.kualitas,
      prediction: kualitas.detransform(prediction[index]),
    }))

    try {
      await axios.put(
        '/api/data-prediction-knn',
        JSON.stringify({ data: dataWithPrediction, reference })
      )

      modal.success({
        title: 'Pengujian Selesai',
        content: 'Proses pengujian dengan KNN berhasil dilakukan.',
      })
    } catch (error) {
      console.error('Error during testing process:', error)
      modal.error({
        title: 'Pengujian Gagal',
        content: 'Terjadi kesalahan saat melakukan proses pengujian.',
      })
    } finally {
      setLoadingTesting(false)
      setData(dataWithPrediction.reverse())
    }
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      sorter: true,
    },
    {
      title: 'PM10',
      dataIndex: 'pm10',
      sorter: true,
    },
    {
      title: 'PM2.5',
      dataIndex: 'pm2_5',
      sorter: true,
    },
    {
      title: 'SO2',
      dataIndex: 'so2',
      sorter: true,
    },
    {
      title: 'CO',
      dataIndex: 'co',
      sorter: true,
    },
    {
      title: 'O3',
      dataIndex: 'o3',
      sorter: true,
    },
    {
      title: 'NO2',
      dataIndex: 'no2',
      sorter: true,
    },
    {
      title: 'Aktual',
      dataIndex: data?.[0]?.actual ? 'actual' : 'kualitas',
      sorter: true,
      filters: [
        { text: 'BAIK', value: 'BAIK' },
        { text: 'SEDANG', value: 'SEDANG' },
        { text: 'TIDAK SEHAT', value: 'TIDAK SEHAT' },
      ],
    },
    {
      title: 'Prediksi',
      dataIndex: 'prediction',
      // sorter: true,
    },
  ]

  return (
    <div>
      {modalContext}
      <h2 className="text-xl font-bold pt-10">Pengujian (KNN)</h2>
      <Divider />
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Proses Pengujian
        </Button>
      </div>

      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={(pagination, filters, sorter) => {
          setTableParams({
            pagination,
            filters,
            sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
            sortField: Array.isArray(sorter) ? undefined : sorter.field,
          })
        }}
        scroll={{ x: 1000 }}
      />

      <Modal
        open={modalVisible}
        title="Proses Pengujian"
        footer={null}
        onCancel={() => !loadingTesting && setModalVisible(false)}
      >
        <article className="text-justify mb-2">
          <p>
            Setelah didapatakan <TextPrimary>data latih baru</TextPrimary> dari
            proses SVM,
            <TextPrimary> data latih baru</TextPrimary> tersebut digunakan
            sebagai <TextPrimary>data latih</TextPrimary> KNN. Kemudian model
            yang dihasilkan akan digunakan untuk memprediksi{' '}
            <TextPrimary>data uji</TextPrimary>.
          </p>
        </article>
        <Form form={form} onFinish={handleProcessTesting}>
          <Form.Item className="text-center">
            <Form.Item
              name={'k_value'}
              label="Nilai K"
              rules={[
                {
                  pattern: /^[0-9]+(\.[0-9]+)?$/,
                  message: 'Harus berupa angka',
                },
                // {
                //   message: 'Harus lebih besar dari 0',
                //   validator: (_, value) => {
                //     if (value === null) {
                //       return Promise.resolve()
                //     }

                //     if (value <= 0) {
                //       return Promise.reject('Harus lebih besar dari 0')
                //     }
                //     return Promise.resolve()
                //   }
                // },
              ]}
            >
              <InputNumber placeholder={'Default = 3'} type="number" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loadingTesting}>
              Uji Sekarang!
            </Button>
          </Form.Item>
        </Form>
        {report?.length ? (
          <>
            <h1 className="subtitle">Laporan Klasifikasi</h1>
            <Table
              dataSource={report}
              rowKey={(record) => record.label}
              columns={[
                {
                  title: '',
                  dataIndex: 'label',
                  key: 'label',
                  render: (value) =>
                    !value.includes('avg') ? (
                      <span className="font-black">
                        {isNaN(value)
                          ? value
                          : kualitas.detransform(parseInt(value))}
                      </span>
                    ) : (
                      value
                    ),
                },
                {
                  title: 'Presisi',
                  dataIndex: 'precision',
                  key: 'precision',
                },
                {
                  title: 'Recall',
                  dataIndex: 'recall',
                  key: 'recall',
                },
                {
                  title: 'F1 Score',
                  dataIndex: 'f1',
                  key: 'f1',
                },
                {
                  title: '',
                  dataIndex: 'support',
                  key: 'support',
                },
              ]}
              pagination={false}
            />
          </>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  )
}

export default PengujianKNN
