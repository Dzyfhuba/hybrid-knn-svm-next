'use client'

import { Modal, Form, Input, message } from 'antd'
import { useEffect } from 'react'

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
  visible: boolean
  onCancel: () => void
  onCreate: (data: DataType) => void
  editData?: DataType
}

const ModalCreate = ({ visible, onCancel, onCreate, editData }: ModalCreateProps) => {
  const [form] = Form.useForm()

  const handleCreate = async () => {
    try {
      const values = await form.validateFields()
      const newData: DataType = {
        id: editData?.id ?? Date.now(),
        ...values,
      }

      const response = await fetch(`/api/raw?id=${newData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      })

      const result = await response.json()

      if (response.ok) {
        message.success('Data berhasil disimpan')
        onCreate(result)
      } else {
        message.error(`Error: ${result.error || 'Gagal menyimpan data'}`)
      }

      form.resetFields()
    } catch {
      message.error('Gagal membuat data')
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
      visible={visible}
      onCancel={onCancel}
      onOk={handleCreate}
      okText={editData ? "Simpan Perubahan" : "Tambah"}
      cancelText="Batal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ pm10: '', pm2_5: '', so2: '', co: '', o3: '', no2: '', kualitas: '' }}
      >
        <Form.Item
          name="pm10"
          label="PM10"
          rules={[{ required: true, message: 'PM10 tidak boleh kosong' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="pm2_5"
          label="PM2.5"
          rules={[{ required: true, message: 'PM2.5 tidak boleh kosong' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="so2"
          label="SO2"
          rules={[{ required: true, message: 'SO2 tidak boleh kosong' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="co"
          label="CO"
          rules={[{ required: true, message: 'CO tidak boleh kosong' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="o3"
          label="O3"
          rules={[{ required: true, message: 'O3 tidak boleh kosong' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="no2"
          label="NO2"
          rules={[{ required: true, message: 'NO2 tidak boleh kosong' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="kualitas"
          label="Kualitas"
          rules={[{ required: true, message: 'Kualitas tidak boleh kosong' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModalCreate
