'use client'

import store from '@/state/store'
import { StoreProvider } from 'easy-peasy'

type Props = {
  children?: React.ReactNode
}

store.dispatch.fetchSession()

const ClientWrapper = (props: Props) => {
  // if (typeof window !== 'undefined') {
  return (
    <StoreProvider store={store}>
      {props.children}
    </StoreProvider>
  )
  // }

  // return (
  //   <>
  //     {props.children}
  //   </>
  // )
}

export default ClientWrapper