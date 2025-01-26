'use client'
import { useStoreActions } from '@/state/hooks'
import { Button, Form, Input, Modal, Space } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Reference = () => {
  const [form] = Form.useForm()
  const [isLoading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const { fetchModel } = useStoreActions((actions) => actions)

  const getReference = async (reference: string | null) => {
    setLoading(true)
    axios.get('/api/model' + (reference ? `?reference=${reference}` : ''))
      .then((response) => {
        if (response.data.item.reference) {
          window.localStorage.setItem('reference', response.data.item.reference)
          form.setFieldsValue({
            reference: response.data.item.reference
          })
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (open && form) {
      fetchModel()
      // const reference = window.localStorage.getItem('reference')

      // getReference(reference)
    }
  }, [open])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (form) {
      const reference = window.localStorage.getItem('reference')
      
      getReference(reference)
    }
  }, [])

  return (
    <>
      <Modal
        open={open}
        footer={null}
        maskClosable
        onCancel={() => {
          setOpen(false)

          const reference = window.localStorage.getItem('reference')

          getReference(reference)
        }}
        onClose={() => {
          setOpen(false)

          const reference = window.localStorage.getItem('reference')

          getReference(reference)
        }}
        classNames={{
          body: 'mt-8'
        }}
      >
        <Form
          form={form}
          // layout=''
          className='w-full'
          onFinish={() => {
            form.validateFields()
              .then((values) => {
                window.localStorage.setItem('reference', values.reference)
                window.location.reload()
              })
          }}
          disabled={isLoading}
        >
          <Space direction='vertical' size={100} />
          <Form.Item
            name='reference'
            label='Reference'
          >
            <Input
              placeholder='Reference'
            />
          </Form.Item>
          <Form.Item>
            <div className="flex gap-1">
              <Button
                type='default'
                htmlType='button'
                onClick={() => {
                  getReference(null)
                }}
                loading={isLoading}
              >
                New
              </Button>
              <Button
                type='primary'
                loading={isLoading}
                htmlType='submit'
              >
                Load
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>

      <Button
        type='primary'
        onClick={() => setOpen(true)}
      >
        Referensi
      </Button>

    </>
  )
}

export default Reference