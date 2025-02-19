'use client'

import {
  downloadTemplateExcel,
  excelToDataRawFormat,
} from '@/helpers/import-xlsx'
import {
  Alert,
  Button,
  Modal,
  notification,
  Table,
  Upload,
  UploadFile,
} from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Database } from '@/types/database'
import { useStoreState } from '@/state/hooks'

type Props = {
  onUploadSuccess?(): void
  totalCurrentData?: number
}

type DataType = Database['svm_knn']['Tables']['raw']['Insert']

const ModalImportData = (props: Props) => {
  const [notify, notificationContext] = notification.useNotification()
  const session = useStoreState((state) => state.session)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataImport, setDataImport] = useState<DataType[]>([])
  const [tableCurrentPage, setTableCurrentPage] = useState(1)
  const [fileImport, setFileImport] = useState<UploadFile | null>(null)
  const [loadingFileImport, setLoadingFileImport] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [errorImport, setErrorImport] = useState<{
    message: string
    errors: { column: string; description: string }[]
  } | null>(null)

  const dataMaximal = 5000
  const totalData = (props.totalCurrentData ?? 0) + dataImport.length
  const isDataOverCapacity = totalData > dataMaximal
  const fileList = fileImport ? [fileImport] : []

  const columns: ColumnsType<DataType> = [
    {
      title: 'No',
      dataIndex: 'id',
      render: (value, _, index) =>
        value ?? index + 1 + 10 * (tableCurrentPage - 1),
    },
    {
      title: 'PM10',
      dataIndex: 'pm10',
    },
    {
      title: 'PM2.5',
      dataIndex: 'pm2_5',
    },
    {
      title: 'SO2',
      dataIndex: 'so2',
    },
    {
      title: 'CO',
      dataIndex: 'co',
    },
    {
      title: 'O3',
      dataIndex: 'o3',
    },
    {
      title: 'NO2',
      dataIndex: 'no2',
    },
    {
      title: 'Kualitas',
      dataIndex: 'kualitas',
    },
  ]

  const handleImportFile = async (file?: File) => {
    setLoadingFileImport(true)
    let errorData = null
    if (file) {
      try {
        const rawData = await excelToDataRawFormat(file)
        setDataImport(rawData)
      } catch (error) {
        const _error = error as { errors: []; message: string }
        setDataImport([])
        errorData = { errors: _error?.errors, message: _error?.message }
      }
    } else setDataImport([])

    setErrorImport(errorData)
    setLoadingFileImport(false)
  }

  const handleUploadData = async (data: DataType[]) => {
    setLoadingUpload(true)
    try {
      const method = 'POST'
      const url = '/api/raw/all'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: session.token ?? '',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        notify.success({ message: 'Data berhasil ditambahkan' })
        setFileImport(null)
        setDataImport([])
        props?.onUploadSuccess?.()
      } else {
        notify.error({
          message: `Error: ${result.error || 'Gagal menyimpan data'}`,
        })
      }
    } catch (error) {
      console.log(error)
      notify.error({ message: 'Gagal upload data' })
    } finally {
      setLoadingUpload(false)
    }
  }

  return (
    <>
      {notificationContext}
      <Button
        type="primary"
        onClick={() => {
          setIsModalOpen(true)
        }}
      >
        Impor Data
      </Button>
      <Modal
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
        title="Impor Data Excel"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false)

          //reset data on modal close
          setDataImport([])
          setErrorImport(null)
          setFileImport(null)
          setTableCurrentPage(1)
        }}
        footer={null}
      >
        <div className="my-10">
          <p className="mb-2">Pilih File Excel:</p>
          <div className="flex justify-between gap-2">
            <Upload
              className="w-full"
              beforeUpload={(file) => {
                setFileImport(file)
                const _file = file as unknown as File
                handleImportFile(_file)

                return false
              }}
              onRemove={() => {
                setFileImport(null)
                handleImportFile()
              }}
              fileList={fileList}
            >
              <Button
                loading={loadingFileImport || loadingUpload}
                className="w-full"
                icon={<UploadOutlined />}
              >
                Pilih File
              </Button>
            </Upload>
            <Button
              disabled={!dataImport.length || isDataOverCapacity}
              type="primary"
              loading={loadingUpload}
              onClick={() => handleUploadData(dataImport)}
            >
              Upload
            </Button>
          </div>
        </div>

        <>
          {errorImport ? (
            <div className="mb-10">
              <b className="capitalize text-red-500">{errorImport.message}</b>
              <p></p>
              <div className="max-h-80 overflow-auto">
                Column Error :{' '}
                {errorImport.errors?.map((item, index) => (
                  <span key={index}>
                    <b>{item?.column}</b>
                    <span className="opacity-60"> ({item?.description}).</span>
                    {errorImport.errors?.length > index + 1 ? ' | ' : ''}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          <div className="text-gray-500 mb-5">
            <p>Kapasitas data maksimal: {dataMaximal}</p>
            <p>Jumlah data sekarang: {props.totalCurrentData}</p>
            <p>Jumlah data impor: {dataImport.length}</p>
            <p>Total data: {dataImport.length + (props.totalCurrentData??0)}</p>
            {isDataOverCapacity ? (
              <Alert
                message="Total data melebihi kapasitas maksimal"
                type="error"
                showIcon
              />
            ) : (
              <></>
            )}
          </div>

          <Table<DataType>
            columns={columns}
            rowKey={(record) => record.id ?? Math.random()}
            dataSource={dataImport}
            scroll={{ x: 1000 }}
            loading={loadingFileImport || loadingUpload}
            caption={
              dataImport.length > 0
                ? `Jumlah Data Impor: ${dataImport.length}`
                : 'Format Data Excel'
            }
            onChange={(pagination) => {
              setTableCurrentPage(pagination.current ?? 1)
            }}
            className="mb-2"
          />
        </>
        <Button type="dashed" onClick={() => downloadTemplateExcel()}>
          Download Template Excel
        </Button>
      </Modal>
    </>
  )
}

export default ModalImportData
