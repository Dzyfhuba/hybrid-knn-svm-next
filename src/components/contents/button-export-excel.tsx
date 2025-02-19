import { exportToExcel } from '@/helpers/export-xlsx'
import { Button, Popconfirm } from 'antd'
import axios from 'axios'
import React, { useState } from 'react'

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
  created_at?: string
  model_id?: number
}

type Props = {
  url: string
  fileName: string
  additionalData?: {
    sheetName: string
    data: Record<string, unknown>[]
  }[]
}

function ButtonExportExcel({ url, additionalData, fileName }: Props) {
  const [loading, setLoading] = useState(false)

  const handleExportToExcel = () => {
    setLoading(true)
    axios
      .get(url)
      .then((res) => {
        const data = {
          sheetName: 'Data',
          data:
            res.data.data?.map((item: DataType) => {
              const actual = item.actual ? { Aktual: item.actual } : {}
              const prediction = item.prediction
                ? { Prediksi: item.prediction }
                : {}
              const kualitas = item.kualitas ? { Kualitas: item.kualitas } : {}

              return {
                No: item.id,
                PM10: item.pm10,
                'PM2.5': item.pm2_5,
                SO2: item.so2,
                CO: item.co,
                O3: item.o3,
                NO2: item.no2,
                ...actual,
                ...prediction,
                ...kualitas,
              }
            }) || [],
        }
        exportToExcel(fileName, [data, ...(additionalData || [])]).then(
          () => {}
        )
      })
      .finally(() => setLoading(false))
  }

  return (
    <Popconfirm
      title={'Ekspor Data Dalam Bentuk Excel?'}
      onConfirm={handleExportToExcel}
      okText="Ya"
      cancelText="Tidak"
    >
      <Button loading={loading}>Ekspor Data</Button>
    </Popconfirm>
  )
}

export default ButtonExportExcel
