type AverageMethod = 'micro' | 'macro' | 'weighted';

class ClassificationReport {
  private confusionMatrix: number[][]
  private classes: (string | number)[]
  private labelMap: Map<(string | number), number>
  private support: number[]
  private predictionClasses: (string | number)[]

  constructor(private trueLabels: (string | number)[], private predictedLabels: (string | number)[]) {
    if (trueLabels.length !== predictedLabels.length) {
      throw new Error('True and predicted labels must have the same length')
    }
    if (trueLabels.length === 0) {
      throw new Error('Input labels cannot be empty')
    }

    this.classes = this.getUniqueSortedLabels([...trueLabels, ...predictedLabels])
    if (this.classes.length === 0) {
      throw new Error('No classes found in input labels')
    }

    this.predictionClasses = this.getUniqueSortedLabels(predictedLabels)

    this.labelMap = new Map(this.classes.map((cls, idx) => [cls, idx]))
    this.confusionMatrix = this.createConfusionMatrix()
    this.support = this.calculateSupport()
  }

  private getUniqueSortedLabels(labels: (string|number)[]): (string | number)[] {
    const allLabels = [...new Set(labels)]
    return allLabels.sort()
  }

  private createConfusionMatrix(): number[][] {
    const matrix = Array.from({ length: this.classes.length }, 
      () => new Array(this.classes.length).fill(0))

    for (let i = 0; i < this.trueLabels.length; i++) {
      const trueIdx = this.labelMap.get(this.trueLabels[i])!
      const predIdx = this.labelMap.get(this.predictedLabels[i])!
      matrix[trueIdx][predIdx]++
    }

    return matrix
  }

  private calculateSupport(): number[] {
    return this.confusionMatrix.map(row => row.reduce((sum, val) => sum + val, 0))
  }

  private getClassMetrics(cls: string | number) {
    const idx = this.labelMap.get(cls)!
    const tp = this.confusionMatrix[idx][idx]
    const fp = this.confusionMatrix.reduce((sum, row, i) => 
      i !== idx ? sum + row[idx] : sum, 0)
    const fn = this.confusionMatrix[idx].reduce((sum, val, j) => 
      j !== idx ? sum + val : sum, 0)

    const precision = tp + fp === 0 ? 0 : tp / (tp + fp)
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn)
    const f1 = precision + recall === 0 ? 0 : 
      (2 * (precision * recall)) / (precision + recall)

    return { precision, recall, f1 }
  }

  private getAverageMetrics(average: AverageMethod) {
    const metrics = this.classes.map(cls => this.getClassMetrics(cls))
    const totalSupport = this.support.reduce((sum, val) => sum + val, 0)
    const totalTP = this.confusionMatrix.reduce((sum, row, idx) => sum + row[idx], 0)

    switch (average) {
    case 'macro':
      return {
        precision: metrics.reduce((sum, m) => sum + m.precision, 0) / this.classes.length,
        recall: metrics.reduce((sum, m) => sum + m.recall, 0) / this.classes.length,
        f1: metrics.reduce((sum, m) => sum + m.f1, 0) / this.classes.length
      }

    case 'weighted':
      return {
        precision: metrics.reduce((sum, m, i) => sum + m.precision * this.support[i], 0) / totalSupport,
        recall: metrics.reduce((sum, m, i) => sum + m.recall * this.support[i], 0) / totalSupport,
        f1: metrics.reduce((sum, m, i) => sum + m.f1 * this.support[i], 0) / totalSupport
      }

    case 'micro':
      const accuracy = totalTP / totalSupport
      return {
        precision: accuracy,
        recall: accuracy,
        f1: accuracy
      }
    default:
      throw new Error(`Invalid average method: ${average}`)
    }
  }

  getAccuracy(): number {
    const total = this.trueLabels.length
    const correct = this.confusionMatrix.reduce((sum, row, idx) => sum + row[idx], 0)
    return total === 0 ? 0 : correct / total
  }

  getErrorRate(): number {
    return 1 - this.getAccuracy()
  }

  getPrecision(cls?: string | number, average: AverageMethod = 'macro'): number {
    if (cls) return this.getClassMetrics(cls).precision
    return this.getAverageMetrics(average).precision
  }

  getRecall(cls?: string | number, average: AverageMethod = 'macro'): number {
    if (cls) return this.getClassMetrics(cls).recall
    return this.getAverageMetrics(average).recall
  }

  getF1Score(cls?: string | number, average: AverageMethod = 'macro'): number {
    if (cls) return this.getClassMetrics(cls).f1
    return this.getAverageMetrics(average).f1
  }

  printReport(digits: number = 2): string {
    const headers = ['', 'Precision', 'Recall', 'F1-Score', 'Support']
    
    // Convert all values to strings explicitly
    const rows = this.predictionClasses.map((cls, idx) => {
      const metrics = this.getClassMetrics(cls)
      return [
        cls.toString(),  // Convert class label to string
        metrics.precision.toFixed(digits),
        metrics.recall.toFixed(digits),
        metrics.f1.toFixed(digits),
        this.support[idx].toString()
      ]
    })

    const averages = [
      { label: 'macro avg', method: 'macro' },
      { label: 'weighted avg', method: 'weighted' },
      { label: 'micro avg', method: 'micro' }
    ]

    const avgMetrics = averages.map(({ label, method }) => {
      const metrics = this.getAverageMetrics(method as AverageMethod)
      return [
        label,
        metrics.precision.toFixed(digits),
        metrics.recall.toFixed(digits),
        metrics.f1.toFixed(digits),
        this.support.reduce((a, b) => a + b, 0).toString()
      ]
    })

    const allRows = [...rows, ...avgMetrics]
    
    // Calculate column widths using string values
    const colWidths = headers.map((_, i) =>
      Math.max(...allRows.map(row => String(row[i]).length), headers[i].length)
    )

    const divider = colWidths.map(w => '-'.repeat(w)).join('-|-')
    const headerRow = headers.map((h, i) => h.padEnd(colWidths[i])).join(' | ')
    
    // Ensure all values are treated as strings during padding
    const report = [
      headerRow,
      divider,
      ...rows.map(row => row.map((c, i) => String(c).padEnd(colWidths[i])).join(' | ')),
      divider,
      ...avgMetrics.map(row => row.map((c, i) => String(c).padEnd(colWidths[i])).join(' | '))
    ].join('\n')

    return `\n${report}\n\nAccuracy: ${this.getAccuracy().toFixed(digits)}\n`
  }

  report(digits: number = 2) {
    // return as array of objects
    const data = this.predictionClasses.map((cls, idx) => {
      const metrics = this.getClassMetrics(cls)
      return {
        label: cls.toString(),
        precision: metrics.precision.toFixed(digits),
        recall: metrics.recall.toFixed(digits),
        f1: metrics.f1.toFixed(digits),
        support: this.support[idx].toString()
      }
    })
    const macros = [
      { label: 'macro avg', method: 'macro' },
      { label: 'weighted avg', method: 'weighted' },
      { label: 'micro avg', method: 'micro' }
    ]
    
    macros.forEach(({ label, method }) => {
      const metrics = this.getAverageMetrics(method as AverageMethod)
      data.push({
        label,
        precision: metrics.precision.toFixed(digits),
        recall: metrics.recall.toFixed(digits),
        f1: metrics.f1.toFixed(digits),
        support: this.support.reduce((a, b) => a + b, 0).toString()
      })
    })

    return data
  }
}

// Example usage:
// const trueLabels = [0, 1, 2, 0, 1, 2]
// const predictedLabels = [0, 2, 1, 0, 0, 1]

// const report = new ClassificationReport(trueLabels, predictedLabels)
// console.log(report.printReport())

// // Individual metric access:
// console.log('Class 0 Precision:', report.getPrecision(0))
// console.log('Macro Recall:', report.getRecall(undefined, 'macro'))
// console.log('Weighted F1:', report.getF1Score(undefined, 'weighted'))
// console.log('Micro Precision:', report.getPrecision(undefined, 'micro'))
// console.log('Accuracy:', report.getAccuracy())
// console.log('Error Rate:', report.getErrorRate())

export default ClassificationReport