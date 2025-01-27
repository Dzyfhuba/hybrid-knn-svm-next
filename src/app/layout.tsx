import Analytics from '@/components/analytics'
import AntProvider from '@/components/ant-provider'
import ClientWrapper from '@/components/client-wrapper'
import Footer from '@/components/footer'
import Navigation from '@/components/navigation'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Divider, Layout } from 'antd'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import '@ant-design/v5-patch-for-react-19'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientWrapper>
          <Analytics />
        </ClientWrapper>

        <AntdRegistry>
          <AntProvider>
            <Layout>
              <Navigation />
              <Layout
              >
                {children}
              </Layout>
              <Divider />
              <Footer />
            </Layout>
          </AntProvider>
        </AntdRegistry>
      </body>
    </html>
  )
}
