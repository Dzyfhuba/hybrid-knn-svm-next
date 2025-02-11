import { GET } from '@/app/api/raw/route'
import kualitas from '@/helpers/kualitas'
import { Database } from '@/types/database'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import ClassificationReport from './classification-report'
import KNN from './knn'

const trainRatios = [0.8, 0.9, 0.7]
const k_s = [3, 5, 7]

// const createMockResponse = () => ({
//   data: vitest.fn().mockReturnThis(),
// })

describe('SVM', () => {
  let data: Database['svm_knn']['Tables']['raw']['Row'][] = []

  it('GET', async () => {
    const request: NextRequest = new NextRequest('http://localhost:3000/api/raw?pageSize=2000')
    const response = await GET(request)
    data = (await response.json()).data as Database['svm_knn']['Tables']['raw']['Row'][]

    expect(response.status).toBe(200)
    expect(data.length).toBe(1461)
    console.log(process.env.SUPABASE_URL)
  })

  trainRatios.forEach(trainRatio => {
    k_s.forEach(k => {
      it(`trainRatio: ${trainRatio}, k: ${k}`, async () => {
        const model = new KNN(k)
            
        const trainLength = Math.floor(data.length * trainRatio)
        const XTrain = data.slice(0, trainLength).map(row => [row.pm10, row.pm2_5, row.so2, row.co, row.o3, row.no2].map(value => value || 0))
        const yTrain = data.slice(0, trainLength).map(row => kualitas.transform(row.kualitas || 'UNKNOWN'))
        const XTest = data.slice(trainLength).map(row => [row.pm10, row.pm2_5, row.so2, row.co, row.o3, row.no2].map(value => value || 0))
        const yTest = data.slice(trainLength).map(row => kualitas.transform(row.kualitas || 'UNKNOWN'))

        model.fit(XTrain, yTrain)

        const yPred = model.predict(XTest)

        const report = new ClassificationReport(
          yTest.map(value => kualitas.detransform(value)),
          yPred.map(value => kualitas.detransform(value))
        )
        const accuracy = report.getAccuracy()
        const precision = report.getPrecision()
        const recall = report.getRecall()
        const f1 = report.getF1Score()

        const matrix = report.getConfusionMatrix()
        console.log('Confusion Matrix:')
        console.table(matrix)

        console.log(`Accuracy: ${accuracy}`)
        console.log(`Precision: ${precision}`)
        console.log(`Recall: ${recall}`)
        console.log(`F1: ${f1}`)
      })
    })
  })
})