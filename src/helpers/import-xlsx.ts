import { Database } from '@/types/database'
import kualitas from './kualitas'
import * as XLSX from 'xlsx'

type DataType = Database['svm_knn']['Tables']['raw']['Insert']

export function reader(file: File) {
  console.log('reader')

  return new Promise<ArrayBuffer>((resolve) => {
    const reader = new FileReader()

    reader.onload = function (event) {
      if (!event?.target?.result) return
      const arrayBuffer = event?.target?.result as ArrayBuffer
      //   let array = new Uint8Array(arrayBuffer)

      resolve(arrayBuffer)
    }

    reader.readAsArrayBuffer(file)
  })
}

export async function excelToDataRawFormat(file: File) {
  if (!file.name.includes('.xls')) {
    console.error('Tipe file tidak sesuai')
    return []
  }

  const res = await reader(file)
  const workbook = XLSX.read(res)
  //   const names = workbook.SheetNames
  const sheets = workbook.Sheets

  const dataArray: DataType[] = []
  const columnsError: { column: string; description: string }[] = []

  //loop the sheets
  for (const keySheet in sheets) {
    const dataItemObj: DataType = {}

    //loop the items of sheet
    for (const keySheetItem in sheets[keySheet]) {
      let value: string = sheets[keySheet][keySheetItem]?.v + '' //converted to string

      //extract column & row of item
      let columnAlphabet = ''
      let rowNumber = ''
      for (const char of keySheetItem) {
        if (isNaN(parseInt(char))) columnAlphabet += char.toUpperCase()
        else rowNumber += char
      }

      //check if column alphabet not more than 'H'
      const isColumnMatches = !(
        columnAlphabet.length > 1 ||
        columnAlphabet[0] < 'A' ||
        columnAlphabet[0] > 'H'
      )

      if (
        keySheetItem !== '!ref' &&
        keySheetItem !== '!margins' &&
        isColumnMatches
      ) {
        //check the table head
        if (rowNumber == '1') {
          value = value.toUpperCase()
          //check for the template / format, if not same break the process
          if (
            !(
              (columnAlphabet == 'A' && value == 'NO') ||
              (columnAlphabet == 'B' && value == 'PM10') ||
              (columnAlphabet == 'C' && value == 'PM2.5') ||
              (columnAlphabet == 'D' && value == 'SO2') ||
              (columnAlphabet == 'E' && value == 'CO') ||
              (columnAlphabet == 'F' && value == 'O3') ||
              (columnAlphabet == 'G' && value == 'NO2') ||
              (columnAlphabet == 'H' && value == 'KUALITAS')
            )
          ) {
            // console.error(
            //   'template tidak sesuai',
            //   `(kolom : ${columnAlphabet})`
            // )
            columnsError.push({
              column: keySheetItem,
              description: 'template tidak sesuai',
            })
            break
          }
        } else {
          const valueInNumber =
            columnAlphabet == 'H' //kolom kualitas
              ? 0 // | value
              : isNaN(parseInt(value))
              ? null
              : parseFloat(value)

          //skip insert data when is null
          if (valueInNumber == null || valueInNumber < 0) {
            //remove history of object item
            if (columnAlphabet == 'B') delete dataItemObj['pm10']
            if (columnAlphabet == 'C') delete dataItemObj['pm2_5']
            if (columnAlphabet == 'D') delete dataItemObj['so2']
            if (columnAlphabet == 'E') delete dataItemObj['co']
            if (columnAlphabet == 'F') delete dataItemObj['o3']
            if (columnAlphabet == 'G') delete dataItemObj['no2']
            // console.error('format tidak sesuai', `(kolom : ${keySheetItem})`)
            columnsError.push({
              column: keySheetItem,
              description:
                'format tidak sesuai, harus berupa angka dan bernilai positif',
            })

            continue
          }

          //insert column data
          if (columnAlphabet == 'A') dataItemObj['id'] = dataArray.length + 1
          if (columnAlphabet == 'B') dataItemObj['pm10'] = valueInNumber
          if (columnAlphabet == 'C') dataItemObj['pm2_5'] = valueInNumber
          if (columnAlphabet == 'D') dataItemObj['so2'] = valueInNumber
          if (columnAlphabet == 'E') dataItemObj['co'] = valueInNumber
          if (columnAlphabet == 'F') dataItemObj['o3'] = valueInNumber
          if (columnAlphabet == 'G') dataItemObj['no2'] = valueInNumber
          if (columnAlphabet == 'H') {
            const isKualitasExist = kualitas.transform(value.toUpperCase())
            if (isKualitasExist) {
              dataItemObj['kualitas'] = value.toUpperCase()

              //if column on H push row to data(rows)
              const dataItemlength = Object.keys(dataItemObj).length
              const totalColumn = 8
              //check item/column length
              if (dataItemlength == totalColumn)
                dataArray.push({ ...dataItemObj })
            } else {
              // console.error(
              //   'format kualitas tidak sesuai',
              //   `(kolom : ${keySheetItem})`
              // )
              columnsError.push({
                column: keySheetItem,
                description:
                  'format kualitas tidak sesuai, kualitas terdiri dari ("Baik", "Sedang", "Tidak Sehat", "Sangat Tidak Sehat", "Berbahaya")',
              })
            }

            //end of column
          }
        }
      }
    }

    //run only first sheet
    break
  }

  return new Promise<DataType[]>((resolve, reject) => {
    if (columnsError.length) {
      reject({ message: 'Terdapat beberapa kesalahan format pada isi kolom!', errors: columnsError })
    } else resolve(dataArray)
  })
}

export async function downloadTemplateExcel() {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet([
    ['No', 'PM10', 'PM2.5', 'SO2', 'CO', 'O3', 'NO2', 'Kualitas'],
  ])

  XLSX.utils.book_append_sheet(wb, ws, 'Data')

  XLSX.writeFile(wb, 'template.xlsx')
}
