'use client'

import { Button, Divider, GetProp, message, Table, TableProps } from "antd"
import { SorterResult } from "antd/es/table/interface"
import { useEffect, useState } from "react"
import qs from 'qs'
import ModalForm from "./form"

interface DataType {
  id: number
  pm10: number
  pm2_5: number
  so2: number
  co: number
  o3: number
  no2: number
  kualitas: string
}

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: SorterResult<DataType>['field'];
  sortOrder?: SorterResult<DataType>['order'];
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>;

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
    ]
  },
]

const Raw = () => {
  const [data, setData] = useState<DataType[]>([])
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const [isModalVisible, setIsModalVisible] = useState(false) 

  const selfUrl = typeof window === 'undefined' ? '' : `${window.location.protocol}//${window.location.host}`

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
  }

  useEffect(fetchData, [
    tableParams.pagination?.current,
    tableParams.pagination?.pageSize,
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ])

  const handleTableChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter) => {
    setTableParams({
      pagination,
      filters,
      sortOrder: Array.isArray(sorter) ? undefined : sorter.order,
      sortField: Array.isArray(sorter) ? undefined : sorter.field,
    })

    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setData([]) 
    }
  }

  const handleCreate = async (newData: DataType) => {
    try {
      const response = await fetch('/api/raw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })

      if (!response.ok) {
        throw new Error('Gagal menambah data')
      }
      message.success('Data berhasil ditambahkan')
      setIsModalVisible(false)
      fetchData()
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error('Terjadi kesalahan tidak dikenal')
      }
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Data Mentah</h2>
      <Divider />
      <Button
        type="primary"
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Tambah Data
      </Button>

      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
      />

      <ModalForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onCreate={handleCreate}
      />
    </div>
  )
}

export default Raw