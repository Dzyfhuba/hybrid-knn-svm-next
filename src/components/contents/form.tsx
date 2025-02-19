'use client'

import { Form, InputNumber, Modal, notification } from 'antd'
import { createRef, useEffect, useState } from 'react'
import DebounceSelect from '../debounce-select'
import ISPU from '@/models/ispu'
import { Criterion } from '@/types/criterion'
import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useStoreState } from '@/state/hooks'

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

const ENABLE_IPSU_PREVIEW = parseInt(process.env.NEXT_PUBLIC_ENABLE_ISPU_PREVIEW || '0') === 1

const ModalForm = ({ open, onCancel, onCreate, editData }: ModalCreateProps) => {
  const session = useStoreState((state) => state.session)
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
          Authorization: session.token ?? '',
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

  const autoFocusRef = createRef<HTMLInputElement>()

  useEffect(() => {
    if (form && open) {
      autoFocusRef.current?.focus()
      if (editData) {
        form.setFieldsValue(editData)
        
        if (ENABLE_IPSU_PREVIEW) {
          const formula = (element: Criterion, value:number) => {
            const {
              indexLower,
              indexUpper,
              concentrationLower,
              concentrationUpper,
            } = ISPU.getStandard(value, element)

            const result = ISPU.calculate(value, element)

            const formula = `
                  \\text{ISPU} = \\frac{(\\text{${indexUpper}} - \\text{${indexLower}})}{(\\text{${concentrationUpper}} - \\text{${concentrationLower}})}
                  \\times (\\text{${value}} - \\text{${concentrationLower}}) + \\text{${indexLower}}
                  \\\\
                  \\text{ISPU} = \\text{${result}}
                  \\\\
                  \\text{Kualitas} = \\text{${ISPU.getLabel(result)}}
                `

            return katex.renderToString(formula, {throwOnError: false})
          }

          setIspu({
            pm10: {
              value: editData.pm10,
              label: ISPU.getLabel(editData.pm10),
              formula: formula('pm10', editData.pm10),
            },
            pm2_5: {
              value: editData.pm2_5,
              label: ISPU.getLabel(editData.pm2_5),
              formula: formula('pm2_5', editData.pm2_5),
            },
            so2: {
              value: editData.so2,
              label: ISPU.getLabel(editData.so2),
              formula: formula('so2', editData.so2),
            },
            co: {
              value: editData.co,
              label: ISPU.getLabel(editData.co),
              formula: formula('co', editData.co),
            },
            o3: {
              value: editData.o3,
              label: ISPU.getLabel(editData.o3),
              formula: formula('o3', editData.o3),
            },
            no2: {
              value: editData.no2,
              label: ISPU.getLabel(editData.no2),
              formula: formula('no2', editData.no2),
            },
          })

          setKualitasRecomendation(ISPU.calculateSummaryWithLabel({
            pm10: form.getFieldValue('pm10') ?? 0,
            pm2_5: form.getFieldValue('pm2_5') ?? 0,
            so2: form.getFieldValue('so2') ?? 0,
            co: form.getFieldValue('co') ?? 0,
            o3: form.getFieldValue('o3') ?? 0,
            no2: form.getFieldValue('no2') ?? 0,
          }))
        }
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
          setKualitasRecomendation('')
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
        {criterion.map((field, idx) => (
          <Form.Item
            key={field.key}
            name={field.key}
            label={field.label.toUpperCase()}
            rules={[
              { required: true, message: `${field.label.toUpperCase()} tidak boleh kosong` },
              { type: 'number', message: `${field.label.toUpperCase()} harus berupa angka` },
              { validator: (_, value) => {
                if (value <= 0 ) return Promise.reject(`${field.label.toUpperCase()} harus lebih dari 0`)
                return Promise.resolve()
              } },
            ]}
            extra={(
              <div
                dangerouslySetInnerHTML={{ __html: ispu[field.key]?.formula || '' }}
              />
            )}
          >
            <InputNumber<number>
              placeholder={`Masukkan ${field.label.toUpperCase()}`}
              type='number'
              addonAfter={field.unit}
              style={{ width: '100%' }}
              ref={idx === 0 ? autoFocusRef : undefined}
              onChange={(value) => {
                // const value = Number(e.currentTarget.value ?? 0)
                if (!value || value <= 0) return
                const {
                  indexLower,
                  indexUpper,
                  concentrationLower,
                  concentrationUpper,
                } = ISPU.getStandard(value, field.key)

                const result = ISPU.calculate(value, field.key)
                if (ENABLE_IPSU_PREVIEW){
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
                }
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
