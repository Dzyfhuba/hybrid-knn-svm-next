const kualitas = {
  transform: (value: string) => {
    switch (value) {
    case 'BAIK':
      return 1
    case 'SEDANG':
      return 2
    case 'TIDAK SEHAT':
      return 3
    case 'SANGAT TIDAK SEHAT':
      return 4
    case 'BERBAHAYA':
      return 5
    default:
      return 0
    }
  },
  detransform: (value: number) => {
    switch (value) {
    case 1:
      return 'BAIK'
    case 2:
      return 'SEDANG'
    case 3:
      return 'TIDAK SEHAT'
    case 4:
      return 'SANGAT TIDAK SEHAT'
    case 5:
      return 'BERBAHAYA'
    default:
      return 'UNKNOWN'
    }
  }
}

export default kualitas