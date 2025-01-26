'use client'
import { Database } from '@/types/database'
import { Button, Form, InputNumber, Modal, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { IoReload } from 'react-icons/io5'

const DataSplit = () => {
  const [modal, modalContext] = Modal.useModal()
  const [form] = Form.useForm()
  const [training, setTraining] = useState(80)
  const [dataTrain, setDataTrain] = useState<Database['svm_knn']['Tables']['data_train']['Row'][]>([])
  const [dataTest, setDataTest] = useState<Database['svm_knn']['Tables']['data_test']['Row'][]>([])

  const columns: ColumnsType<Database['svm_knn']['Tables']['data_train']['Row']> = [
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
    if (await form.validateFields()) {
      const { training, testing } = form.getFieldsValue()
      modal.confirm({
        title: 'Split Data',
        content: `Apakah anda yakin untuk membagi data dengan rasio ${training}:${testing}?`,
        onOk: () => {
          setTraining(training)

          modal.success({
            title: 'Data Berhasil Dibagi',
            content: `Data berhasil dibagi dengan rasio ${training}:${testing}.`,
          })
        }
      })
    }
  }

  const fetchDataTrain = async (reference: string | null) => {
    const data: Database['svm_knn']['Tables']['data_train']['Row'][] = await axios.get('/api/data-train' + (reference ? `?reference=${reference}` : ''))
      .then(response => response.data.data)
    
    setDataTrain(data)
  }

  const fetchDataTest = async (reference: string | null) => {
    const data: Database['svm_knn']['Tables']['data_test']['Row'][] = await axios.get('/api/data-test' + (reference ? `?reference=${reference}` : ''))
      .then(response => response.data.data)
    
    setDataTest(data)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const reference = window.localStorage.getItem('reference')

      fetchDataTrain(reference)
      fetchDataTest(reference)
    }
  }, [])

  return (
    <div>
      {modalContext}

      <h2 className="text-xl font-bold">Data Split</h2>
      
      <Form
        form={form}
        layout='horizontal'
        labelCol={{ span: 8 }}
        initialValues={{
          training: 80,
          testing: 20
        }}
        className='w-full sm:w-max'
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
              message: 'Data Training harus diisi dengan angka 0-100'
            }
          ]}
        >
          <InputNumber
            type='number'
            placeholder='Data Training (%)'
            addonAfter="%"
            className='w-full sm:w-max'
            onKeyUp={(e) => {
              const value = e.currentTarget.valueAsNumber || 0
              const testing = 100 - value
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
            placeholder='Data Testing (%)'
            addonAfter="%"
            className='w-full sm:w-max'
            readOnly
          />
        </Form.Item>

        <Form.Item>
          <div className='flex items-center gap-1'>
            <Button
              type="primary"
              danger
              htmlType="reset"
              icon={<IoReload />}
              disabled={training === 80}
            />
            <Button
              type="primary"
              htmlType="submit"
            >
              Split Data
            </Button>
          </div>
        </Form.Item>
      </Form>

      <div>
        <h3 className="text-lg font-bold">Data Latih</h3>

        <Table<Database['svm_knn']['Tables']['data_train']['Row']>
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={dataTrain}
          scroll={{ x: 1000 }}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold">Data Uji</h3>

        <Table<Database['svm_knn']['Tables']['data_test']['Row']>
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={dataTest}
          scroll={{ x: 1000 }}
        />
      </div>
    </div>
  )
}

export default DataSplit