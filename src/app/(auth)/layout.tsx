import ClientWrapper from '@/components/client-wrapper'
import React from 'react'

function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <ClientWrapper>{children}</ClientWrapper>
}

export default AuthLayout
