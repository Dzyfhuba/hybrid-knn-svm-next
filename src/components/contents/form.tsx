'use client'

import { Modal, Form, Input, message, Select } from 'antd'
import { useEffect, useState } from 'react'

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
    } else {
      form.resetFields()
    }
  }, [editData, form, open])

  return (
    <Modal
      title={editData ? `Edit Data ID: ${editData.id}` : 'Tambah Data'}
      open={open}
      onCancel={onCancel}
      onOk={handleCreate}
      okText={editData ? 'Simpan Perubahan' : 'Tambah'}
      cancelText="Batal"
      confirmLoading={loading}
    >
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
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
        {['pm10', 'pm2_5', 'so2', 'co', 'o3', 'no2'].map((field) => (
          <Form.Item
            key={field}
            name={field}
            label={field.toUpperCase()}
            rules={[
              { required: true, message: `${field.toUpperCase()} tidak boleh kosong` },
              { pattern: /^\d+$/, message: `${field.toUpperCase()} harus berupa angka` },
            ]}
          >
            <Input placeholder={`Masukkan ${field.toUpperCase()}`} />
          </Form.Item>
        ))}

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
