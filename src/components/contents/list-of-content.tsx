'use client'
import { Anchor, Button, Drawer } from 'antd'
import { useState } from 'react'
import { HiMenuAlt3 } from 'react-icons/hi'

const listOfContent = [
  {
    title: 'Data Mentah',
    href: '#raw',
    key: '#raw'
  },
  // {
  //   title: "Ekspor dan Impor Data", // Tambahkan ini
  //   href: "#export-import",
  //   key: "#export-import"
  // },
  // {
  //   title: 'Normalisasi',
  //   href: '#normalization',
  //   key: '#normalization',
  // },
  // {
  //   title: "Data Bersih",
  //   href: "#clean",
  //   key: "#clean"
  // },
  {
    title: 'Pelatihan (SVM)',
    href: '#train',
    key: '#train'
  },
  {
    title: 'Pengujian (KNN)',
    href: '#test',
    key: '#test'
  },
]

const ListOfContent = () => {
  return (
    <>
      <Anchor
        affix={false}
        items={listOfContent}
      />
    </>
  )
}

const DrawerListOfContent = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Drawer
        title='Daftar Konten'
        placement={'right'}
        onClose={() => setOpen(false)}
        open={open}
        width={200}
        classNames={{
          wrapper: 'h-max !top-[10vh]',
          content: '!rounded-l'
        }}
      >
        <ListOfContent />
      </Drawer>

      <Button
        icon={<HiMenuAlt3 size={28} />}
        type='primary'
        size='large'
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          top: '10vh',
          right: 0,
          zIndex: 100
        }}
        className='!rounded-r-none rounded-br'
      />
    </>
  )
}

export { DrawerListOfContent }

export default ListOfContent