'use client'

import {
  Button,
  Checkbox,
  Divider,
  GetProp,
  message,
  Modal,
  Table,
  TableProps,
} from 'antd'
import { SorterResult } from 'antd/es/table/interface'
import { useEffect, useState } from 'react'
import qs from 'qs'
import ModalForm from './form'
import ModalImportData from './modal-import-data'
import { useStoreState } from '@/state/hooks'
import axios from 'axios'
import ButtonExportExcel from './button-export-excel'

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
  pagination?: TablePaginationConfig
  sortField?: SorterResult<DataType>['field']
  sortOrder?: SorterResult<DataType>['order']
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1]
}

type ColumnsType<T extends object = object> = TableProps<T>['columns']
type TablePaginationConfig = Exclude<GetProp<TableProps, 'pagination'>, boolean>

const Raw = () => {
  const { session } = useStoreState((state) => state)
  const [modal, modalContext] = Modal.useModal()

  const [isClient, setIsClient] = useState(false)
  const [data, setData] = useState<DataType[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  })
  const [isModalopen, setIsModalopen] = useState(false)
  const [editData, setEditData] = useState<DataType | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
  const [allIdRawData, setAllIdRawData] = useState<number[]>([])

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

  const fetchData = () => {
    setLoading(true)
    fetch(`${selfUrl}/api/raw?${qs.stringify(parseParams(tableParams))}`)
      .then((res) => res.json())
      .then((res) => {
        setData(res.data ?? [])
        setLoading(false)
        setTotal(res.total)
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
    tableParams?.sortOrder,
    tableParams?.sortField,
    JSON.stringify(tableParams.filters),
  ])

  const fetchAllIdRawData = () => {
    axios
      .get('/api/raw/all/id')
      .then((res) =>
        setAllIdRawData(res.data.data?.map((item: { id: string }) => item.id))
      )
      .catch(() => {})
  }

  useEffect(() => {
    fetchAllIdRawData()
    setIsClient(true)
  }, [])

  const handleTableChange: TableProps<DataType>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
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

  const handleDelete = (id: number) => {
    modal.confirm({
      title: 'Konfirmasi Penghapusan',
      content: 'Apakah Anda yakin ingin menghapus data ini?',
      okText: 'Ya',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          const response = await fetch(`/api/raw?id=${id}`, {
            method: 'DELETE',
            headers: { Authorization: session.token ?? '' },
          })

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Gagal menghapus data: ${errorText}`)
          }

          message.success('Data berhasil dihapus')
          fetchData()
          fetchAllIdRawData()
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error pada handleDelete:', error.message)
            message.error(error.message)
          } else {
            message.error('Terjadi kesalahan')
          }
        }
      },
    })
  }

  const handleDeleteSelectedData = () => {
    modal.confirm({
      title: 'Konfirmasi Penghapusan',
      content: `Apakah Anda yakin ingin menghapus ${selectedRowKeys.length} data ini?`,
      okText: 'Ya',
      cancelText: 'Batal',
      onOk: async () => {
        try {
          const response = await fetch('/api/raw/all', {
            method: 'DELETE',
            body: JSON.stringify(selectedRowKeys),
          })

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`Gagal menghapus data: ${errorText}`)
          }

          message.success('Data berhasil dihapus')
          setSelectedRowKeys([])
          fetchData()
          fetchAllIdRawData()
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error pada handleDelete:', error.message)
            message.error(error.message)
          } else {
            message.error('Terjadi kesalahan')
          }
        }
      },
    })
  }

  const columns: ColumnsType<DataType> = [
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
      // filters: [
      //   { text: 'BAIK', value: 'BAIK' },
      //   { text: 'SEDANG', value: 'SEDANG' },
      //   { text: 'TIDAK SEHAT', value: 'TIDAK SEHAT' },
      // ],
    },
    {
      title: 'Aksi',
      render: (_, record) =>
        isClient && session.token ? (
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type="primary"
              style={{ borderRadius: '4px' }}
              onClick={() => {
                setEditData(record)
                setIsModalopen(true)
              }}
            >
              Edit
            </Button>

            <Button
              type="primary"
              danger
              style={{ borderRadius: '4px' }}
              onClick={() => handleDelete(record.id)}
            >
              Hapus
            </Button>
          </div>
        ) : (
          <></>
        ),
    },
  ]

  return (
    <div>
      {modalContext}
      <div className="flex justify-between items-center pt-10">
        <h2 className="text-xl font-bold">Data Mentah</h2>
        {isClient && !session.isLoading && session.token ? (
          <ModalImportData
            totalCurrentData={total}
            onUploadSuccess={() => {
              fetchData()
              fetchAllIdRawData()
            }}
          />
        ) : (
          <></>
        )}
      </div>
      <Divider />
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
        {isClient && session.token ? (
          <Button
            type="primary"
            onClick={() => {
              setEditData(null)
              setIsModalopen(true)
            }}
            style={{ marginBottom: 16 }}
          >
            Tambah Data
          </Button>
        ) : (
          <></>
        )}
        <ButtonExportExcel
          fileName={'Data_Raw'}
          url={'/api/raw?pageSize=5000'}
        />
        {/* <Button type="primary" onClick={handleExport}>
          Ekspor Data
        </Button>
        <Button type="primary" onClick={handleImport}>
          Impor Data
        </Button> */}
      </div>
      <Table<DataType>
        columns={columns}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={tableParams.pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        caption={
          <div>
            {data.length > 0 ? `Total Data: ${total}` : undefined}

            {session.token && selectedRowKeys.length ? (
              <div className="mt-2 space-x-5">
                <span>Dipilih: {selectedRowKeys.length}</span>
                <Button
                  type="primary"
                  size="small"
                  danger
                  style={{ borderRadius: '4px' }}
                  onClick={handleDeleteSelectedData}
                >
                  Hapus data yang dipilih
                </Button>
              </div>
            ) : (
              ''
            )}
          </div>
        }
        rowSelection={{
          columnTitle() {
            return (
              <Checkbox
                disabled={loading}
                indeterminate={
                  selectedRowKeys.length &&
                  selectedRowKeys.length !== allIdRawData.length
                    ? true
                    : false
                }
                onChange={(e) => {
                  if (e.target.checked) setSelectedRowKeys(allIdRawData)
                  else setSelectedRowKeys([])
                }}
                checked={
                  !!(
                    selectedRowKeys.length &&
                    selectedRowKeys.length == allIdRawData.length
                  )
                }
              ></Checkbox>
            )
          },
          selectedRowKeys: selectedRowKeys,
          onSelect: (record, isSelect) => {
            //for manual fillter select data
            const newSelectedRowKeys = isSelect
              ? [...selectedRowKeys, record.id]
              : selectedRowKeys.filter((key) => key !== record.id)

            setSelectedRowKeys(newSelectedRowKeys)
          },
        }}
      />
      <ModalForm
        open={isModalopen}
        onCancel={() => {
          setIsModalopen(false)
          setEditData(null)
        }}
        onCreate={(data: DataType) => {
          console.log('Creating data:', data)
          setIsModalopen(false)
          setEditData(null)
          fetchData()
          fetchAllIdRawData()
        }}
        editData={editData || undefined}
      />
    </div>
  )
}

export default Raw
