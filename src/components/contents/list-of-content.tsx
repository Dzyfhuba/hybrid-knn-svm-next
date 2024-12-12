import { Anchor } from "antd"

const listOfContent = [
  {
    title: "Data Mentah",
    href: "#raw",
    key: "#raw"
  },
  {
    title: "Ekspor dan Impor Data", // Tambahkan ini
    href: "#export-import",
    key: "#export-import"
  },
  {
    title: "Normalisasi",
    href: "#normalization",
    key: "#normalization",
  },
  // {
  //   title: "Data Bersih",
  //   href: "#clean",
  //   key: "#clean"
  // },
  {
    title: "Pelatihan (SVM)",
    href: "#train",
    key: "#train"
  },
  {
    title: "Pengujian (KNN)",
    href: "#test",
    key: "#test"
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