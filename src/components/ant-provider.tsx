'use client'

import { ConfigProvider, theme } from 'antd'

type Props = {
  children: React.ReactNode
}

const AntProvider = (props: Props) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.defaultAlgorithm, theme.darkAlgorithm],
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
          },
        },
      }}
    >
      {props.children}
    </ConfigProvider>
  )
}

export default AntProvider