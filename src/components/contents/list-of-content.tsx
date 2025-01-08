import { Anchor } from 'antd'

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
    href: '#Pelatihan (SVM)',
    key: '#Pelatihan (SVM)'
  },
  {
    title: 'Pengujian (KNN)',
    href: '#Pengujian (KNN)',
    key: '#Pengujian (KNN)'
  },
]

const ListOfContent = () => {
  return (
    <Anchor
      affix={false}
      items={listOfContent}
    />
  )
}

export default ListOfContent