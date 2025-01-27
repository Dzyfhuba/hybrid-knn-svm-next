'use client'

import SVM from '@/models/svm'
import { useStoreActions, useStoreState } from '@/state/hooks'
import { Database } from '@/types/database'
import { Button, Divider, Form, InputNumber, Modal, Skeleton, Table, TableProps } from 'antd'
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
  const fetchModel = useStoreActions((actions) => actions.fetchModel)
  const [form] = Form.useForm()

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

  const defaultParams = {
    learningRate: 0.001,
    regularization: 1.0,
    epochs: 1000,
    checkpointInterval: 100,
  }

  const handleTrain = async () => {
    setLoadingTraining(true)

    const reference = model.reference
    // load data
    const train = await axios.get(`/api/data-train/all${reference ? `?reference=${reference}` : ''}`)
      .then((res) => res.data.data as Database['svm_knn']['Tables']['data_train']['Row'][])

    const learningRate = form.getFieldValue('learning_rate') as number || defaultParams.learningRate
    const regularization = form.getFieldValue('regularization') as number || defaultParams.regularization
    const epochs = form.getFieldValue('epochs') as number || defaultParams.epochs
    const checkpointInterval = form.getFieldValue('checkpoint_interval') as number || defaultParams.checkpointInterval

    console.log('SVM Construction...')
    const svm = new SVM.MultiClass({
      learningRate,
      regularization,
      epochs,
      checkpointInterval,
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
        afterOpenChange={(open) => {
          if (open) {
            fetchModel()
          }
        }}
      >
        <Form
          labelCol={{ span: 8 }}
          onFinish={handleTrain}
          form={form}
        >
          <Form.Item
            name={'learning_rate'}
            label='Laju Pembelajaran'
            rules={[
              {
                pattern: /^[0-9]+(\.[0-9]+)?$/,
                message: 'Harus berupa angka',
              },
              {
                message: 'Harus lebih besar dari 0',
                validator: (_, value) => {
                  if (value === null) {
                    return Promise.resolve()
                  }

                  if (value <= 0) {
                    return Promise.reject('Harus lebih besar dari 0')
                  }
                  return Promise.resolve()
                }
              },
              {
                message: 'Tidak boleh lebih dari 1',
                validator: (_, value) => {
                  if (value > 1) {
                    return Promise.reject('Harus lebih kecil dari 1')
                  }
                  return Promise.resolve()
                }
              },
            ]}
            extra='Laju pembelajaran adalah seberapa cepat model belajar'
          >
            <InputNumber
              placeholder={`Default = ${defaultParams.learningRate}`}
              type='number'
            />
          </Form.Item>
          <Form.Item
            name={'regularization'}
            label='Regulasi'
            rules={[
              {
                pattern: /^[0-9]+(\.[0-9]+)?$/,
                message: 'Harus berupa angka',
              },
              {
                message: 'Harus lebih besar dari 0',
                validator: (_, value) => {
                  if (value === null) {
                    return Promise.resolve()
                  }

                  if (value <= 0) {
                    return Promise.reject('Harus lebih besar dari 0')
                  }
                  return Promise.resolve()
                }
              },
              {
                message: 'Tidak boleh lebih dari 1',
                validator: (_, value) => {
                  if (value > 1) {
                    return Promise.reject('Harus lebih kecil dari 1')
                  }
                  return Promise.resolve()
                }
              },
            ]}
            extra='Regulasi adalah seberapa besar model menghindari overfitting'
          >
            <InputNumber
              placeholder={`Default = ${defaultParams.regularization}`}
              type='number'
            />
          </Form.Item>
          <Form.Item
            name={'epochs'}
            label='Epochs'
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: 'Harus berupa angka',
              },
              {
                message: 'Tidak boleh lebih dari 10000000',
                validator: (_, value) => {
                  if (value > 10000000) {
                    return Promise.reject('Harus lebih kecil dari 10000000')
                  }
                  return Promise.resolve()
                }
              },
              {
                message: 'Tidak boleh lebih kecil dari 1',
                validator: (_, value) => {
                  if (value === null) {
                    return Promise.resolve()
                  }
                  
                  if (value < 1) {
                    return Promise.reject('Harus lebih besar dari 1')
                  }
                  return Promise.resolve()
                }
              }
            ]}
            extra='Epochs adalah seberapa banyak model belajar'
          >
            <InputNumber
              type='number'
              placeholder={`Default = ${defaultParams.epochs}`}
            />
          </Form.Item>
          <Form.Item
            name={'checkpoint_interval'}
            label='Checkpoint Interval'
            extra='Checkpoint Interval adalah seberapa sering model menyimpan checkpoint'
            rules={[
              {
                pattern: /^[0-9]+$/,
                message: 'Harus berupa angka',
              },
              {
                message: 'Tidak boleh kurang dari 10% jumlah epochs',
                validator: (_, value) => {
                  if (value === null) {
                    return Promise.resolve()
                  }
                  
                  if (value < form.getFieldValue('epochs') / 10) {
                    return Promise.reject('Tidak boleh kurang dari 10% jumlah epochs')
                  }
                  return Promise.resolve()
                }
              },
              {
                message: 'Tidak boleh lebih dari 50% jumlah epochs',
                validator: (_, value) => {
                  if (value > form.getFieldValue('epochs') / 2) {
                    return Promise.reject('Tidak boleh lebih dari 50% jumlah epochs')
                  }
                  return Promise.resolve()
                }
              }
            ]}
          >
            <InputNumber
              type='number'
              placeholder={`Default = ${Math.round(defaultParams.epochs / 10)}`}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType='submit'
          >
          Latih Sekarang!
          </Button>
        </Form>

        <Skeleton active loading={LoadingTraining}  />
      </Modal>
    </div>
  )
}

export default TrainingSVM
