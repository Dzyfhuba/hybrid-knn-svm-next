import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { Inter } from 'next/font/google'
import './globals.css'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import moment from 'moment'
import ScrollToTop from '@/components/ScrollToTop'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

moment.locale('id')
console.log(moment())
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <ThemeProvider>
          <Navbar />
          <main className='p-3'>
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
