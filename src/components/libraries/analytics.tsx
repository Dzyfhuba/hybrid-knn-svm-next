'use client'
import { analytics } from '@/libraries/firebase'
import { isSupported, logEvent } from 'firebase/analytics'
import { useEffect } from 'react'

const Analytics = () => {
  useEffect(() => {
    // if (typeof window === 'undefined') return
    isSupported().then((supported) => {
      if (supported) {
        logEvent(analytics, 'page_view', {
          page_location: window.location.href,
          page_path: window.location.pathname,
          page_title: document.title,
          page_host: window.location.hostname,
        })
      }
    })
  }, [])

  return (
    <></>
  )
}

export default Analytics