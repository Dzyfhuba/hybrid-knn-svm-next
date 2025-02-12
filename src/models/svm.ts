class Linear {
  private learningRate: number
  private regularization: number
  private epochs: number
  private weights: number[]
  private bias: number
  private lossHistory: number[] = []
  private checkpointInterval: number

  constructor({
    learningRate = 0.001,
    regularization = 1.0,
    epochs = 1000,
    checkpointInterval = 100,
  }) {
    this.learningRate = learningRate
    this.regularization = regularization
    this.epochs = epochs
    this.checkpointInterval = checkpointInterval

    this.weights = []
    this.bias = 0
  }

  fit(X: number[][], y: number[]) {
    const nSamples = X.length
    const nFeatures = X[0].length
    const y_ = y.map(label => label <= 0 ? -1 : 1)

    this.weights = new Array(nFeatures).fill(0)
    this.bias = 0

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      for (let i = 0; i < nSamples; i++) {
        const condition = y_[i] * (this.dot(X[i], this.weights) + this.bias) >= 1
        if (condition) {
          this.weights = this.weights.map((w) => w - this.learningRate * (2 * w / nSamples))
        } else {
          this.weights = this.weights.map((w, j) => w - this.learningRate * (2 * w / nSamples - X[i][j] * y_[i] * this.regularization))
          this.bias += this.learningRate * y_[i] * this.regularization
        }
      }

      this.lossHistory.push(this.computeLoss(X, y_))
      if (epoch % this.checkpointInterval === 0) {
        console.log(`Epoch ${epoch}, Loss: ${this.lossHistory[this.lossHistory.length - 1]}`)
      }
    }

    console.log(`Training complete. Final Loss: ${this.lossHistory[this.lossHistory.length - 1]}`)
  }

  private computeLoss(X: number[][], y: number[]): number {
    const marginLosses = X.map((x_i, i) => Math.max(0, 1 - y[i] * (this.dot(x_i, this.weights) + this.bias)))
    const regularization = 0.5 * this.dot(this.weights, this.weights)
    return regularization + this.regularization * marginLosses.reduce((acc, loss) => acc + loss, 0)
  }

  decisionFunction(X: number[][]): number[] {
    return X.map(x_i => this.dot(x_i, this.weights) + this.bias)
  }

  predict(X: number[][]): number[] {
    return this.decisionFunction(X).map(decision => Math.sign(decision))
  }

  private dot(X: number[], weights: number[]): number {
    return X.reduce((acc, x, i) => acc + x * weights[i], 0)
  }

  getLosshistory(){
    return this.lossHistory
  }
  
  getTrainedResults() {
    return {
      weights: this.weights,
      bias: this.bias,
    }
  }
}

class MultiClass {
  private learningRate: number
  private regularization: number
  private epochs: number
  private models: Linear[] = []
  private classes: number[] = []
  private checkpointInterval: number

  constructor({
    learningRate = 0.001,
    regularization = 1.0,
    epochs = 1000,
    checkpointInterval = 100,
  }) {
    this.learningRate = learningRate
    this.regularization = regularization
    this.epochs = epochs
    this.checkpointInterval = checkpointInterval
  }

  fit(X: number[][], y: number[]) {
    this.classes = Array.from(new Set(y))
    for (const cls of this.classes) {
      const yBinary = y.map(label => label === cls ? 1 : -1)
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

  predict(X: number[][]): number[] {
    const decisionValues = this.models.map(model => model.decisionFunction(X))
    return decisionValues[0].map((_, i) => {
      const decisions = decisionValues.map(values => values[i])
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

  getLosshistory(){
    return this.models.map((model, i) => ({
      class: this.classes[i],
      data: model.getLosshistory(),
    }))
  }

  getTrainedResults() {
    return {
      learningRate: this.learningRate,
      regularization: this.regularization,
      epochs: this.epochs,
      checkpointInterval: this.checkpointInterval,
      models: this.models.map(model => model.getTrainedResults()),
      classes: this.classes,
    }
  }
}

const SVM = {
  Linear,
  MultiClass,
}

export default SVM