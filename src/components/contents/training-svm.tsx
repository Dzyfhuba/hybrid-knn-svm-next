'use client'

import SVM from '@/models/svm'
import { useStoreState } from '@/state/hooks'
import { Database } from '@/types/database'
import { Button, Divider, Modal, Skeleton, Table, TableProps } from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import axios from 'axios'
import qs from 'qs'
import { useEffect, useState } from 'react'

interface DataType {
  id: number;
  pm10: number;
  pm2_5: number;
  so2: number;
  co: number;
  o3: number;
  no2: number;
  kualitas: string;
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<DataType>['field'];
  sortOrder?: SorterResult<DataType>['order'];
  filters?: Record<string, FilterValue | null>;
}

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<TableProps<DataType>['pagination'], boolean>;

const TrainingSVM = () => {
  const [data, setData] = useState<DataType[]>([])
  const model = useStoreState((state) => state.model)

  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [LoadingTraining, setLoadingTraining] = useState(false)
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
    sortField: params.sortField,
    sortOrder: params.sortOrder,
    ...params.filters,
  })

  const fetchData = () => {
    setLoading(true)
    fetch(`${selfUrl}/api/raw?${qs.stringify(parseParams(tableParams))}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data)
        setLoading(false)
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: res.total,
          },
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })
  }

  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams.sortOrder,
    tableParams.sortField,
    JSON.stringify(tableParams.filters),
  ])

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
      title: 'Kualitas',
      dataIndex: 'kualitas',
      sorter: true,
      filters: [
        { text: 'BAIK', value: 'BAIK' },
        { text: 'SEDANG', value: 'SEDANG' },
        { text: 'TIDAK SEHAT', value: 'TIDAK SEHAT' },
      ],
    },
  ]

  const handleTrain = async () => {
    setLoadingTraining(true)

    const reference = model.reference
    // load data
    const train = await axios.get(`/api/data-train/all${reference ? `?reference=${reference}` : ''}`)
      .then((res) => res.data.data as Database['svm_knn']['Tables']['data_train']['Row'][])

    console.log('SVM Construction...')
    const svm = new SVM.MultiClass({
      learningRate: 0.00001,
      regularization: 1.0,
      epochs: 100000,
      checkpointInterval: 10000,
    })

    const X = train.map((item) => [
      item.pm10,
      item.pm2_5,
      item.so2,
      item.co,
      item.o3,
      item.no2,
    ]).filter((item) => item.every((i) => i !== null))
    const y = train.map((item) => {
      switch (item.kualitas) {
      case 'BAIK':
        return 1
      case 'SEDANG':
        return 2
      case 'TIDAK SEHAT':
        return 3
      case 'SANGAT TIDAK SEHAT':
        return 4
      case 'BERBAHAYA':
        return 5
      default:
        return 0
      }
    })

    console.log('Training SVM...')
    svm.fit(X, y)
    console.log('Training done')

    const prediction = svm.predict(X)
    console.log('Prediction:', prediction)

    setLoadingTraining(false)
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Pelatihan (SVM)</h2>
      <Divider />
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setModalVisible(true)}>
          Proses Pelatihan
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
        title="Proses Pelatihan"
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <Button
          type="primary"
          htmlType='button'
          onClick={(e) => {
            console.log('SVM Construction...', e.target)

            console.log('Training SVM...')
            handleTrain()
            // setModalVisible(false)
          }}
          loading={LoadingTraining}
        >
          Latih Sekarang!
        </Button>

        <Skeleton active loading={LoadingTraining}  />
      </Modal>
    </div>
  )
}

export default TrainingSVM
