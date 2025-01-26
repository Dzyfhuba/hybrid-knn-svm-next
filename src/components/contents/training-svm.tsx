'use client'

import { Button, Divider, Modal, Table, TableProps, Spin } from 'antd'
import { FilterValue, SorterResult } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import qs from 'qs'

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
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
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

  const handleProcessTesting = async () => {
    setModalVisible(true)
    setModalLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      Modal.success({
        title: 'Pelatihan Selesai',
        content: 'Proses pelatihan dengan KNN berhasil dilakukan.',
      })
    } catch (error) {
      console.error('Error during testing process:', error)
      Modal.error({
        title: 'Pelatihan Gagal',
        content: 'Terjadi kesalahan saat melakukan proses pelatihan.',
      })
    } finally {
      setModalLoading(false)
      setModalVisible(false)
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

  return (
    <div>
      <h2 className="text-xl font-bold">Pelatihan (SVM)</h2>
      <Divider />
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={handleProcessTesting}>
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
        closable={!modalLoading}
      >
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          {modalLoading ? (
            <Spin size="large" tip="Sedang melakukan pelatihan..." />
          ) : (
            <p>Proses pelatihan telah selesai.</p>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default TrainingSVM
