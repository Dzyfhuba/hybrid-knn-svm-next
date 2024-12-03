import ClientWrapper from "@/components/client-wrapper"
import Footer from "@/components/footer"
import Analytics from "@/components/libraries/analytics"
import Navigation from "@/components/navigation"
import { AntdRegistry } from "@ant-design/nextjs-registry"
import { ConfigProvider, Divider, Layout } from "antd"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
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
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#ee6d12',
            },
            components: {
              Layout: {
                headerBg: 'var(--background)',
                headerColor: 'var(--foreground)',
                siderBg: 'var(--background)',
                footerBg: 'var(--background)',
                colorBgBase: 'var(--background)',
                colorBgLayout: 'var(--background)',
                colorText: 'var(--foreground)',
              },
              Divider: {
                colorSplit: 'var(--foreground)',
              },
              Anchor: {
                colorText: 'var(--foreground)',
                colorLinkActive: '#ff0000',
              }
            },
          }}
        >
          <ClientWrapper>
            <Analytics />
          </ClientWrapper>

          <AntdRegistry>
            <Layout>
              <Navigation />
              <div
                className="container mx-auto p-3"
              >
                <Layout
                  className="flex !flex-col sm:!flex-row"
                >
                  {children}
                </Layout>
                <Divider />
                <Footer />
              </div>
            </Layout>
          </AntdRegistry>
        </ConfigProvider>
      </body>
    </html>
  )
}
