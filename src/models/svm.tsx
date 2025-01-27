class Linear {
  private learningRate: number = 0.001
  private regularization: number = 1.0
  private epochs: number = 1000

  private weights: number[] = []
  private bias: number = 0

  private weightsHistory: number[][] = []
  private biasHistory: number[] = []
  private lossHistory: number[] = []

  private checkpointInterval: number = 10

  constructor({
    learningRate = 0.001,
    regularization = 1.0,
    epochs = 1000,
    checkpointInterval = 10,
  }) {
    this.learningRate = learningRate
    this.regularization = regularization
    this.epochs = epochs
    this.checkpointInterval = checkpointInterval
  }

  fit(X: number[][], y: number[]) {
    // Inisiasi panjang data dan jumlah fitur
    const nSample = X.length
    const nFeatures = X[0].length

    // Inisiasi bobot dan bias
    this.weights = new Array(nFeatures).fill(0)
    this.bias = 0

    // Proses training
    for (let epoch = 0; epoch < this.epochs; epoch++) {
      // Penentuan bobot dan bias
      for (let i = 0; i < nSample; i++) {
        const X_i = X[i]
        const y_i = y[i]

        // Menghitung hyperplane
        if (this.hyperplane(X_i, y_i, this.weights, this.bias) >= 1) {
          // Jika hyperplane >= 1, update bobot, tidak ada hinge loss (hinge loss adalah kerugian yang terjadi ketika hyperplane < 1)
          // Sehingga hanya perlu mengupdate bobot dengan regularisasi
          this.weights = this.weights.map((w) => w - this.learningRate * (2 * this.regularization * w))
        } else {
          // Jika hyperplane < 1, update bobot dan bias, karena ada hinge loss
          // Sehingga perlu mengupdate bobot dan bias dengan regularisasi
          this.weights = this.weights.map((w, j) => w - this.learningRate * (2 * this.regularization * w - X_i[j] * y_i))
          this.bias -= this.learningRate * y_i * this.regularization
        }
      }

      // Menghitung loss setiap epoch (loss adalah gabungan antara regularisasi dan hinge loss)
      const loss = this.loss(X, y)
      if (epoch % this.checkpointInterval === 0) {
        console.log(`Epoch ${epoch}, loss: ${loss}`)
        // Simpan bobot dan bias
        this.weightsHistory.push([...this.weights])
        this.biasHistory.push(this.bias)

        // Simpan loss
        this.lossHistory.push(loss)
      }
    }
  }

  predict(X: number[][]) {
    return this.decisionFunction(X).map((decision) => decision >= 0 ? 1 : -1)
  }

  decisionFunction(X: number[][]) {
    return X.map((X_i) => this.dot(X_i, this.weights) + this.bias)
  }

  getHistory() {
    return {
      weights: this.weightsHistory,
      bias: this.biasHistory,
      lost: this.lossHistory,
    }
  }

  dot(X: number[], weights: number[]) {
    return X.reduce((acc, x, i) => acc + x * weights[i], 0)
  }

  hyperplane(X: number[], y: number, weights: number[], bias: number) {
    return y * (this.dot(X, weights) + bias)
  }

  loss(X: number[][], y: number[]): number {
    // Regularization term
    const regTerm = 0.5 * this.regularization * this.dot(this.weights, this.weights)

    // Hinge loss
    const hingeLoss = X.reduce((acc, X_i, i) => {
      const margin = y[i] * (this.dot(X_i, this.weights) + this.bias)
      return acc + Math.max(0, 1 - margin)
    }, 0)

    return regTerm + hingeLoss
  }
}

class MultiClass {
  private learningRate: number
  private regularization: number
  private epochs: number
  private models: Linear[] = []
  private classes: number[] = []

  private checkpointInterval: number = 10

  constructor({
    learningRate = 0.001,
    regularization = 1.0,
    epochs = 1000,
    checkpointInterval = 10,
  }) {
    this.learningRate = learningRate
    this.regularization = regularization
    this.epochs = epochs
    this.checkpointInterval = checkpointInterval
  }

  fit(X: number[][], y: number[]) {
    this.classes = Array.from(new Set(y))
    for (const cls of this.classes) {
      const yBinary = y.map((label) => (label === cls ? 1 : -1))
      console.log(`Training class ${cls} vs all`)
      const model = new Linear({
        learningRate: this.learningRate,
        regularization: this.regularization,
        epochs: this.epochs,
        checkpointInterval: this.checkpointInterval,
      })
      model.fit(X, yBinary)
      this.models.push(model)
    }
  }

  predict(X: number[][]) {
    const decisionValues = this.models.map((model) => model.decisionFunction(X))
    return decisionValues[0].map((_, i) => {
      const decisions = decisionValues.map((values) => values[i])
      return this.classes[decisions.indexOf(Math.max(...decisions))]
    })
  }

  printWeightsAndBiases() {
    this.models.forEach((model, i) => {
      console.log(`Class ${this.classes[i]}:`)
      console.log(`  Weights: ${model['weights']}`)
      console.log(`  Bias: ${model['bias']}`)
    })
  }
}

const SVM = {
  Linear,
  MultiClass,
}

export default SVM