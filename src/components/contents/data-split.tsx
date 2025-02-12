'use client'
import { useStoreActions, useStoreState } from '@/state/hooks'
import { Database } from '@/types/database'
import {
  Button,
  Form,
  GetProp,
  InputNumber,
  Modal,
  Table,
  message as Message,
} from 'antd'
import { ColumnsType, TablePaginationConfig, TableProps } from 'antd/es/table'
import { SorterResult } from 'antd/es/table/interface'
import axios from 'axios'
import QueryString from 'qs'
import { useEffect, useState } from 'react'

interface TableParams {
  pagination?: TablePaginationConfig
  sortField?: SorterResult<
    Database['svm_knn']['Tables']['data_train']['Row']
  >['field']
  sortOrder?: SorterResult<
    Database['svm_knn']['Tables']['data_train']['Row']
  >['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

const DataSplit = () => {
  const [isClient, setIsClient] = useState(false)
  const [modal, modalContext] = Modal.useModal()
  const [message, messageContext] = Message.useMessage()
  const [form] = Form.useForm()
  const [training, setTraining] = useState(() => {
    const trainingValue =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('training')
        : null
    return trainingValue ? parseInt(trainingValue) : 80
  })
  const { model } = useStoreState((state) => state)
  const actions = useStoreActions((actions) => actions)

  const columns: ColumnsType<
    Database['svm_knn']['Tables']['data_train']['Row']
  > = [
    {
      title: 'No',
      dataIndex: 'id',
      sorter: true,
    },
    {
      title: 'PM10 (µg/m³)',
      dataIndex: 'pm10',
      sorter: true,
    },
    {
      title: 'PM2.5 (µg/m³)',
      dataIndex: 'pm2_5',
      sorter: true,
    },
    {
      title: 'SO2 (µg/m³)',
      dataIndex: 'so2',
      sorter: true,
    },
    {
      title: 'CO (mg/m³)',
      dataIndex: 'co',
      sorter: true,
    },
    {
      title: 'O3 (µg/m³)',
      dataIndex: 'o3',
      sorter: true,
    },
    {
      title: 'NO2 (µg/m³)',
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

  const handleSubmit = async () => {
    const reference =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('reference')
        : null
    if (!reference) {
      modal.error({
        title: 'Referensi tidak ada',
        content: 'Buat referensi terlebih dahulu!',
      })
      return
    }

    if (await form.validateFields()) {
      const { training, testing } = form.getFieldsValue()
      modal.confirm({
        title: 'Split Data',
        content: `Apakah anda yakin untuk membagi data dengan rasio ${training}:${testing}?`,
        autoFocusButton: 'ok',
        onOk: async () => {
          setTraining(training)
          const reference = window.localStorage.getItem('reference')
          window.localStorage.setItem('training', training.toString())

          const payload = {
            train_length: training,
            test_length: testing,
            reference,
          }

          actions.setModel((prev) => ({
            ...prev,
            train_percentage: training,
          }))

          // refetch data
          // fetchDataTrain()
          // fetchDataTest()

          return await axios.put('/api/data-split', payload).then((res) => {
            setDataTrain(res.data.extra.data_train)
            setTableParamsTrain({
              pagination: {
                current: 1,
                pageSize: 10,
              },
            })
            setTotalTrain(res.data.extra.data_train.length)
            setDataTest(res.data.extra.data_test)
            setTableParamsTest({
              pagination: {
                current: 1,
                pageSize: 10,
              },
            })
            setTotalTest(res.data.extra.data_test.length)

            console.log(res.data)

            message.success(
              'Data berhasil dipisahkan dengan rasio ' +
                training +
                ':' +
                testing
            )
          })
        },
      })
    }
  }

  const [dataTrain, setDataTrain] = useState<
    Database['svm_knn']['Tables']['data_train']['Row'][]
  >([])
  const [totalTrain, setTotalTrain] = useState(0)
  const [dataTest, setDataTest] = useState<
    Database['svm_knn']['Tables']['data_test']['Row'][]
  >([])
  const [loadingTrain, setLoadingTrain] = useState(false)
  const [tableParamsTrain, setTableParamsTrain] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const [totalTest, setTotalTest] = useState(0)
  const [loadingTest, setLoadingTest] = useState(false)
  const [tableParamsTest, setTableParamsTest] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })

  const parseParams = (params: TableParams) => ({
    ...params.pagination,
    orderBy: params.sortField,
    order: params.sortOrder === 'ascend' ? 'asc' : 'desc',
    ...params.filters,
    reference: window.localStorage.getItem('reference'),
  })

  const fetchDataTrain = () => {
    setLoadingTrain(true)
    fetch(
      `/api/data-train?${QueryString.stringify(parseParams(tableParamsTrain))}`
    )
      .then((res) => res.json())
      .then((res) => {
        setDataTrain(res.data ?? [])
        console.log(res.total)
        setTotalTrain(res.total)
        setLoadingTrain(false)
        setTableParamsTrain({
          ...tableParamsTrain,
          pagination: {
            ...tableParamsTrain.pagination,
            total: res.total,
          },
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoadingTrain(false)
      })
  }
  const fetchDataTest = () => {
    setLoadingTest(true)
    fetch(
      `/api/data-test?${QueryString.stringify(parseParams(tableParamsTest))}`
    )
      .then((res) => res.json())
      .then((res) => {
        setDataTest(res.data)
        setTotalTest(res.total)
        setLoadingTest(false)
        setTableParamsTest({
          ...tableParamsTest,
          pagination: {
            ...tableParamsTest.pagination,
            total: res.total,
          },
        })
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        setLoadingTest(false)
      })
  }

  useEffect(fetchDataTrain, [
    tableParamsTrain.pagination?.current,
    tableParamsTrain.pagination?.pageSize,
    tableParamsTrain?.sortOrder,
    tableParamsTrain?.sortField,
    JSON.stringify(tableParamsTrain.filters),
  ])
  useEffect(fetchDataTest, [
    tableParamsTest.pagination?.current,
    tableParamsTest.pagination?.pageSize,
    tableParamsTest?.sortOrder,
    tableParamsTest?.sortField,
    JSON.stringify(tableParamsTest.filters),
  ])

  const handleTableChangeTrain: TableProps<
    Database['svm_knn']['Tables']['data_train']['Row']
  >['onChange'] = (pagination, filters, sorter) => {
    setTableParamsTrain({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    if (pagination.pageSize !== tableParamsTrain.pagination?.pageSize) {
      setDataTrain([])
    }
  }
  const handleTableChangeTest: TableProps<
    Database['svm_knn']['Tables']['data_test']['Row']
  >['onChange'] = (pagination, filters, sorter) => {
    setTableParamsTest({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    if (pagination.pageSize !== tableParamsTest.pagination?.pageSize) {
      setDataTest([])
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log(model.train_percentage, training)
    if (form) {
      form.setFieldsValue({
        training: model.train_percentage || 80,
        testing: 100 - (model.train_percentage || 80),
      })
    }
  }, [model.train_percentage, form])

  useEffect(() => {
    //To prevent hydration error in next js when initial view contains input html
    setIsClient(true)
  }, [])

  return (
    <div>
      {modalContext}
      {messageContext}

      <h2 className="text-xl font-bold pt-10">Data Split</h2>
      {isClient ? (
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 8 }}
          // initialValues={{
          //   training: model.train_percentage || 80,
          //   testing: 20
          // }}
          className="w-full sm:w-max"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="training"
            label="Data Training"
            rules={[
              {
                required: true,
                message: 'Data Training harus diisi',
              },
              {
                type: 'number',
                min: 0,
                max: 100,
                message: 'Data Training harus diisi dengan angka 0-100',
              },
            ]}
          >
            <InputNumber
              type="number"
              placeholder="Data Training (%)"
              addonAfter="%"
              className="w-full sm:w-max"
              onKeyUp={(e) => {
                const value = e.currentTarget.valueAsNumber || 0
                const testing = 100 - value
                setTraining(value)
                form.setFieldsValue({ testing })
              }}
            />
          </Form.Item>
          <Form.Item
            name="testing"
            label="Data Testing"
            rules={[
              {
                required: true,
                message: 'Data Testing harus diisi',
              },
            ]}
          >
            <InputNumber
              placeholder="Data Testing (%)"
              addonAfter="%"
              className="w-full sm:w-max"
              readOnly
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={
                training === model.train_percentage && dataTrain.length > 0
              }
            >
              Split Data
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <></>
      )}
      <div>
        <h3 className="text-lg font-bold">Data Latih</h3>

        <Table<Database['svm_knn']['Tables']['data_train']['Row']>
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={dataTrain}
          pagination={tableParamsTrain.pagination}
          loading={loadingTrain}
          onChange={handleTableChangeTrain}
          scroll={{ x: 1000 }}
          caption={totalTrain > 0 ? `Total Data: ${totalTrain}` : undefined}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold">Data Uji</h3>

        <Table<Database['svm_knn']['Tables']['data_test']['Row']>
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={dataTest}
          pagination={tableParamsTest.pagination}
          loading={loadingTest}
          onChange={handleTableChangeTest}
          scroll={{ x: 1000 }}
          caption={totalTest > 0 ? `Total Data: ${totalTest}` : undefined}
        />
      </div>
    </div>
  )
}

export default DataSplit
