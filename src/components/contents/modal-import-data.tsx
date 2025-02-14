'use client'

import {
  downloadTemplateExcel,
  excelToDataRawFormat,
} from '@/helpers/import-xlsx'
import { Button, Modal, notification, Table, Upload, UploadFile } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Database } from '@/types/database'

type Props = {
  onUploadSuccess?(): void
}

type DataType = Database['svm_knn']['Tables']['raw']['Insert']

const ModalImportData = (props: Props) => {
  const [notify, notificationContext] = notification.useNotification()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataImport, setDataImport] = useState<DataType[]>([])
  const [tableCurrentPage, setTableCurrentPage] = useState(1)
  const [fileImport, setFileImport] = useState<UploadFile | null>(null)
  const [loadingFileImport, setLoadingFileImport] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)

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
    if (file) {
      const rawData = await excelToDataRawFormat(file)
      setDataImport(rawData)
    } else setDataImport([])
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
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <div className="my-10">
          <p className="mb-2">Pilih File Excel:</p>
          <div className="flex justify-between gap-2">
            {/* <Input
              type="file"
              accept=".xlsx,.xls"
              className="cursor-pointer"
              onChange={async (value) => {
                setDataImport([])
                console.log('onchange')
                const file = value.target.files?.[0]
                if (file) handleImportFile(file)

                console.log(file)
              }}
            /> */}
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
              disabled={!dataImport.length}
              type="primary"
              loading={loadingUpload}
              onClick={() => handleUploadData(dataImport)}
            >
              Upload
            </Button>
          </div>
        </div>

        <>
          <Table<DataType>
            columns={columns}
            rowKey={(record) => record.id ?? Math.random()}
            dataSource={dataImport}
            scroll={{ x: 1000 }}
            loading={loadingFileImport || loadingUpload}
            caption={
              dataImport.length > 0
                ? `Total Data: ${dataImport.length} (terseleksi)`
                : 'Format Data Excel'
            }
            onChange={(pagination) => {
              setTableCurrentPage(pagination.current ?? 1)
            }}
            className='mb-2'
          />
        </>
        <Button
          type="dashed"
          onClick={() => downloadTemplateExcel()}
        >
          Download Template Excel
        </Button>
      </Modal>
    </>
  )
}

export default ModalImportData
