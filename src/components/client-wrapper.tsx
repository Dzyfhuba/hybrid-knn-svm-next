'use client'


type Props = {
  children?: React.ReactNode
}

const ClientWrapper = (props: Props) => {
  if (typeof window !== 'undefined') {
    return (
      <>
        {props.children}
      </>
    )
  }

  return (
    <>
    </>
  )
}

export default ClientWrapper