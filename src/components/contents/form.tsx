'use client'

import { Form, InputNumber, Modal, notification } from 'antd'
import { useEffect, useState } from 'react'
import DebounceSelect from '../debounce-select'
import ISPU from '@/models/ispu'
import { Criterion } from '@/types/criterion'
import katex from 'katex'
import 'katex/dist/katex.min.css'

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

interface ModalCreateProps {
  open: boolean;
  onCancel: () => void;
  onCreate: (data: DataType) => void;
  editData?: DataType;
}

const ModalForm = ({ open, onCancel, onCreate, editData }: ModalCreateProps) => {
  const [form] = Form.useForm()
  const [notify, notificationContext] = notification.useNotification()
  const [loading, setLoading] = useState(false)
  const [kualitasRecomendation, setKualitasRecomendation] = useState('')
  const [ispu, setIspu] = useState<{
    [key in Criterion]?: {
      value?: number;
      label?: string;
      formula?: string;
    }
  }>({})
  const criterion: { key: Criterion; label: string; unit: string }[] = [{
    key: 'pm10',
    label: 'PM10',
    unit: 'µg/m³',
  }, {
    key: 'pm2_5',
    label: 'PM2.5',
    unit: 'µg/m³',
  }, {
    key: 'so2',
    label: 'SO2',
    unit: 'µg/m³',
  }, {
    key: 'co',
    label: 'CO',
    unit: 'mg/m³',
  }, {
    key: 'o3',
    label: 'O3',
    unit: 'µg/m³',
  }, {
    key: 'no2',
    label: 'NO2',
    unit: 'µg/m³',
  }]

  const handleCreate = async () => {
    if (loading) return

    setLoading(true)
    try {
      const values = await form.validateFields()
      const newData: DataType = {
        id: editData?.id,
        ...values,
      }

      const method = editData ? 'PATCH' : 'POST'
      const url = editData ? `/api/raw?id=${editData.id}` : '/api/raw'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })

      const result = await response.json()

      if (response.ok) {
        notify.success({ message: editData ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan' })
        onCreate(result)
        form.resetFields()
      } else {
        notify.error({ message: `Error: ${result.error || 'Gagal menyimpan data'}` })
        form.setFields(Object.entries(result.errors).map(([key, value]) => ({
          name: key,
          errors: Array.isArray(value) ? value : [String(value)],
        })))
      }

    } catch {
      notify.error({ message: 'Gagal membuat data' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (form && open) {
      if (editData) {
        form.setFieldsValue(editData)
      }
    }
  }, [editData, form, open])

  return (
    <>{notificationContext}
      <Modal
        title={editData ? `Edit Data ID: ${editData.id}` : 'Tambah Data'}
        open={open}
        onCancel={onCancel}
        onOk={handleCreate}
        okButtonProps={{ htmlType: 'submit' }}
        cancelButtonProps={{ htmlType: 'reset' }}
        okText={editData ? 'Simpan Perubahan' : 'Tambah'}
        cancelText="Batal"
        confirmLoading={loading}
        afterClose={() => {
          form.resetFields()
          setIspu({})
        }}
        modalRender={(modal) => (
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ style: { width: '100%' } }}
            layout="horizontal"
          >
            {modal}
          </Form>
        )}
      >
        {criterion.map((field) => (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label.toUpperCase()}
            rules={[
              { required: true, message: `${field.label.toUpperCase()} tidak boleh kosong` },
              { pattern: /^\d+$/, message: `${field.label.toUpperCase()} harus berupa angka` },
              { pattern: /^[0-9]+$/, message: `${field.label.toUpperCase()} tidak boleh negatif` },
            ]}
            extra={(
              <div
                dangerouslySetInnerHTML={{ __html: ispu[field.key]?.formula || '' }}
              />
            )}
          >
            <InputNumber
              placeholder={`Masukkan ${field.label.toUpperCase()}`}
              type='number'
              addonAfter={field.unit}
              style={{ width: '100%' }}
              onKeyUp={(e) => {
                const value = Number(e.currentTarget.value ?? 0)
                const {
                  indexLower,
                  indexUpper,
                  concentrationLower,
                  concentrationUpper,
                } = ISPU.getStandard(value, field.key)

                const result = ISPU.calculate(value, field.key)

                const formula = `
                  \\text{ISPU} = \\frac{(\\text{${indexUpper}} - \\text{${indexLower}})}{(\\text{${concentrationUpper}} - \\text{${concentrationLower}})}
                  \\times (\\text{${value}} - \\text{${concentrationLower}}) + \\text{${indexLower}}
                  \\\\
                  \\text{ISPU} = \\text{${result}}
                  \\\\
                  \\text{Kualitas} = \\text{${ISPU.getLabel(result)}}
                `
                const renderedFormula = katex.renderToString(formula, {throwOnError: false})

                setIspu((prev) => ({
                  ...prev,
                  [field.key]: {
                    value: value,
                    label: ISPU.getLabel(value),
                    formula: renderedFormula,
                  },
                }))

                setKualitasRecomendation(ISPU.calculateSummaryWithLabel({
                  pm10: form.getFieldValue('pm10') ?? 0,
                  pm2_5: form.getFieldValue('pm2_5') ?? 0,
                  so2: form.getFieldValue('so2') ?? 0,
                  co: form.getFieldValue('co') ?? 0,
                  o3: form.getFieldValue('o3') ?? 0,
                  no2: form.getFieldValue('no2') ?? 0,
                }))
              }}
            />
          </Form.Item>
        ))}

        <Form.Item
          name="kualitas"
          label="Kualitas"
          rules={[{ required: true, message: 'Kualitas tidak boleh kosong' }]}
          extra={kualitasRecomendation ? (
            <div>
              <p>
                Rekomendasi kualitas udara: <strong>{kualitasRecomendation}</strong>
              </p>
            </div>
          ) : <></>}
        >
          <DebounceSelect
            route="/api/kualitas"
            placeholder="Pilih kualitas udara"
          />
        </Form.Item>
      </Modal>
    </>
  )
}

export default ModalForm
