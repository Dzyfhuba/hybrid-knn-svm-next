import response from '@/helpers/response'

export async function GET() {
  const data = [
    {
      label: 'BAIK',
      value: 'BAIK',
    },
    {
      label: 'SEDANG',
      value: 'SEDANG',
    },
    {
      label: 'TIDAK SEHAT',
      value: 'TIDAK SEHAT',
    },
    {
      label: 'SANGAT TIDAK SEHAT',
      value: 'SANGAT TIDAK SEHAT',
    },
    {
      label: 'BERBAHAYA',
      value: 'BERBAHAYA',
    }
  ]

  return response.success({ data })
}