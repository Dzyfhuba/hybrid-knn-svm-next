import * as XLSX from 'xlsx'

interface DataExport {
  sheetName: string
  data: Record<string, unknown>[]
}

export async function exportToExcel(
  fileName: string,
  dataExport: DataExport[]
) {
  return new Promise((resolve) => {
    const wb = XLSX.utils.book_new()

    for (const sheet of dataExport) {
      //     const ws = XLSX.utils.aoa_to_sheet([
      //     //   ['No', 'PM10', 'PM2.5', 'SO2', 'CO', 'O3', 'NO2', 'Kualitas'],
      //     ])
      const ws = XLSX.utils.json_to_sheet(sheet.data)
      XLSX.utils.book_append_sheet(wb, ws, sheet.sheetName)
    }

    XLSX.writeFile(wb, fileName.replace(' ','') + '.xlsx')

    resolve({ status: 'success' })
  })
}
