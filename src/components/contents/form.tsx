'use client'

import { Modal, Form, Input, message, Select } from 'antd'
import { useEffect, useState } from 'react'

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

interface ModalCreateProps {
  open: boolean
  onCancel: () => void
  onCreate: (data: DataType) => void
  editData?: DataType
}

const ModalForm = ({ open, onCancel, onCreate, editData }: ModalCreateProps) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (loading) return

    setLoading(true)
    try {
      const values = await form.validateFields()
      const newData: DataType = {
        id: editData?.id ?? Date.now(),
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
        message.success(editData ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan')
        onCreate(result)
      } else {
        message.error(`Error: ${result.error || 'Gagal menyimpan data'}`)
      }

      form.resetFields()
    } catch {
      message.error('Gagal membuat data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData)
    }
  }, [editData, form])

  return (
    <Modal
      title={editData ? "Edit Data" : "Tambah Data"}
      open={open}
      onCancel={onCancel}
      onOk={handleCreate}
      okText={editData ? "Simpan Perubahan" : "Tambah"}
      cancelText="Batal"
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="horizontal"
        initialValues={{
          pm10: '',
          pm2_5: '',
          so2: '',
          co: '',
          o3: '',
          no2: '',
          kualitas: '',
        }}
      >
        {/* PM10 */}
        <Form.Item
          name="pm10"
          label="PM10"
          rules={[{ required: true, message: 'PM10 tidak boleh kosong' }]}
        >
          <Input type="number" placeholder="Masukkan PM10" min={0} />
        </Form.Item>

        {/* PM2.5 */}
        <Form.Item
          name="pm2_5"
          label="PM2.5"
          rules={[{ required: true, message: 'PM2.5 tidak boleh kosong' }]}
        >
          <Input type="number" placeholder="Masukkan PM2.5" min={0} />
        </Form.Item>

        {/* SO2 */}
        <Form.Item
          name="so2"
          label="SO2"
          rules={[{ required: true, message: 'SO2 tidak boleh kosong' }]}
        >
          <Input type="number" placeholder="Masukkan SO2" min={0} />
        </Form.Item>

        {/* CO */}
        <Form.Item
          name="co"
          label="CO"
          rules={[{ required: true, message: 'CO tidak boleh kosong' }]}
        >
          <Input type="number" placeholder="Masukkan CO" min={0} />
        </Form.Item>

        {/* O3 */}
        <Form.Item
          name="o3"
          label="O3"
          rules={[{ required: true, message: 'O3 tidak boleh kosong' }]}
        >
          <Input type="number" placeholder="Masukkan O3" min={0} />
        </Form.Item>

        {/* NO2 */}
        <Form.Item
          name="no2"
          label="NO2"
          rules={[{ required: true, message: 'NO2 tidak boleh kosong' }]}
        >
          <Input type="number" placeholder="Masukkan NO2" min={0} />
        </Form.Item>

        {/* Kualitas */}
        <Form.Item
          name="kualitas"
          label="Kualitas"
          rules={[{ required: true, message: 'Kualitas tidak boleh kosong' }]}
        >
          <Select placeholder="Pilih Kualitas">
            <Select.Option value="BAIK">BAIK</Select.Option>
            <Select.Option value="SEDANG">SEDANG</Select.Option>
            <Select.Option value="TIDAK SEHAT">TIDAK SEHAT</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalForm
