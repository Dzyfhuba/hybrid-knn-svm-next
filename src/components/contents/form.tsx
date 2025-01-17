'use client'

import { Form, InputNumber, Modal, notification } from 'antd'
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
  const [notify, notificationContext] = notification.useNotification()
  const [loading, setLoading] = useState(false)

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
        modalRender={(modal) => (
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            {modal}
          </Form>
        )}
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
            <InputNumber placeholder={`Masukkan ${field.toUpperCase()}`} />
          </Form.Item>
        ))}

        {/* <Form.Item
          name="kualitas"
          label="Kualitas"
          rules={[{ required: true, message: 'Kualitas tidak boleh kosong' }]}
        >
          <Select
            placeholder="Pilih Kualitas"
            optionFilterProp='label'
            showSearch
            options={['BAIK', 'SEDANG', 'TIDAK SEHAT'].map((kualitas) => ({
              label: kualitas,
              value: kualitas,
            }))}
          />
        </Form.Item> */}
      </Modal>
    </>
  )
}

export default ModalForm
