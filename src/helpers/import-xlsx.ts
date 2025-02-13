import { Database } from '@/types/database'
import kualitas from './kualitas'
import * as XLSX from 'xlsx'

type DataType = Database['svm_knn']['Tables']['raw']['Insert']

export function reader(file: File) {
  console.log('reader')

  return new Promise<ArrayBuffer>((resolve) => {
    let reader = new FileReader()

    reader.onload = function (event) {
      if (!event?.target?.result) return
      let arrayBuffer = event?.target?.result as ArrayBuffer
      //   let array = new Uint8Array(arrayBuffer)

      //   // Display some information about the file
      //   let fileSize = arrayBuffer.byteLength
      //   let bytes = []
      //   for (let i = 0; i < Math.min(20, fileSize); i++) {
      //     bytes.push(array[i])
      //   }
      //   console.log('ArrayBuffer:', arrayBuffer)

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
  let workbook = XLSX.read(res)
  //   const names = workbook.SheetNames
  const sheets = workbook.Sheets

  let dataArray: DataType[] = []

  //loop the sheets
  for (const keySheet in sheets) {
    let dataItemObj: DataType = {}

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
            console.error('format tidak sesuai', `(kolom : ${columnAlphabet})`)
            return [] //break
          }
        } else {
          const valueInNumber =
            columnAlphabet == 'H' || columnAlphabet == 'A' //kolom kualitas & nomer
              ? 0 // | value
              : isNaN(parseInt(value))
              ? null
              : parseFloat(value)

          //skip insert data when is null
          if (valueInNumber == null) continue

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
            }

            //end of column
          }
        }
      }
    }

    //run only first sheet
    break
  }

  // console.log(dataArray, sheets)
  return dataArray
}
