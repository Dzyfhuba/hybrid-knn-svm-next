'use client'

import { useStoreActions, useStoreState } from '@/state/hooks'
import { Button } from 'antd'
import { Footer as FooterBase } from 'antd/es/layout/layout'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const Footer = () => {
  const session = useStoreState((state) => state.session)
  const deleteSession = useStoreActions((actions) => actions.deleteSession)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <FooterBase className="flex justify-between">
      <div>
        <p>Hybrid SVM-KNN</p>
        <p>Oleh : Dimas Lintang Nugroho</p>
      </div>

      <div className="flex items-center gap-5">
        {isClient ? (
          session.token ? (
            <Button
              type="link"
              onClick={async () => {
                deleteSession()
              }}
            >
              Logout
            </Button>
          ) : (
            <Link href={'/login'}>Login</Link>
          )
        ) : (
          <></>
        )}
      </div>
    </FooterBase>
  )
}

export default Footer
