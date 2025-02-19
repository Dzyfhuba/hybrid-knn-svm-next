'use client'

import { useStoreActions, useStoreState } from '@/state/hooks'
import { Button, Form, FormProps, Input } from 'antd'
import { Content } from 'antd/es/layout/layout'
import useNotification from 'antd/es/notification/useNotification'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Login() {
  const session = useStoreState((state) => state.session)
  const setSession = useStoreActions((actions) => actions.setSession)
  const [notification, notificationContex] = useNotification()
  const [loading, setLoading] = useState(false)

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogin: FormProps<{
    email: string
    password: string
  }>['onFinish'] = async (values) => {
    setLoading(true)
    try {
      const data = await axios.post(
        '/api/login',
        JSON.stringify({ email: values.email, password: values.password })
      )

      localStorage.setItem('session', JSON.stringify(data.data || ''))
      setSession({
        token: data.data?.access_token,
        isLoading: false,
        email: data.data?.user.email ?? '',
      })
      notification.success({ message: 'Login Success' })
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        //@ts-expect-error type not setup
        description: error?.response.data.errors,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {notificationContex}
      <Content className="p-3 sm:max-w-(--breakpoint-lg) sm:mx-auto h-[70vh]">
        <div className="h-full flex items-center">
          {!session.isLoading && isClient ? (
            session.token ? (
              <div className="text-center">
                <p>You have logged in</p>
                <p className="text-gray-500">
                  {session.email
                    .split('@')[0]
                    .split('')
                    .map((char, idx, arr) =>
                      idx == 0 ? char : idx < arr.length / 3 ? char : '*'
                    )}
                  @{session.email.split('@')[1]}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-xl mb-5">Login Admin</h2>
                <Form disabled={loading} layout="vertical" onFinish={handleLogin}>
                  <Form.Item
                    name={'email'}
                    label="Email"
                    required
                    rules={[{ required: true }]}
                  >
                    <Input type="email" />
                  </Form.Item>
                  <Form.Item
                    name={'password'}
                    label="Password"
                    required
                    rules={[{ required: true }]}
                  >
                    <Input.Password />
                  </Form.Item>
                  <Button loading={loading} type="primary" htmlType="submit">
                    Login
                  </Button>
                </Form>
              </div>
            )
          ) : (
            <></>
          )}
        </div>
      </Content>
    </>
  )
}

export default Login
