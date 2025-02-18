'use client'

import supabase from '@/libraries/supabase'
import { useStoreActions, useStoreState } from '@/state/hooks'
import { Button, Form, FormProps, Input } from 'antd'
import { Content } from 'antd/es/layout/layout'
import useNotification from 'antd/es/notification/useNotification'
import React, { useEffect, useState } from 'react'

function Login() {
  const session = useStoreState((state) => state.session)
  const setSession = useStoreActions((actions) => actions.setSession)
  const [notification, notificationContex] = useNotification()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogin: FormProps<{
    email: string
    password: string
  }>['onFinish'] = async (values) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      notification.error({
        message: 'Login Failed',
        description: error.message,
      })
    }

    if (error == null && data.session !== null) {
      notification.success({ message: 'Login Success' })
      setSession({
        token: data.session?.access_token,
        isLoading: false,
        email: data.session?.user.email ?? '',
      })
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
                <Form layout="vertical" onFinish={handleLogin}>
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
                  <Button type="primary" htmlType="submit">
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
