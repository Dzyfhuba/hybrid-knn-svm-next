import Data from '@/types/data'

const splitData =  <T extends Array<Data>>(data: T, ratio: number = 0.8) => {
  const feat = data.map(item => [item.pm10!, item.pm2_5!, item.so2!, item.co!, item.o3!, item.no2!])
  const labels = data.map(item => {
    if (item.category === 'baik') {
      return 1
    } else if (item.category === 'sedang') {
      return 2
    } else { //tidak sehat
      return 3
    }
  })

  const trainSize = Math.floor(feat.length * ratio)
  const trainFeatures = feat.slice(0, trainSize)
  const trainLabels = labels.slice(0, trainSize)
  const testFeatures = feat.slice(trainSize)
  const testLabels = labels.slice(trainSize)

  return {
    trainFeatures,
    trainLabels,
    testFeatures,
    testLabels
  }
}

export default splitData