class ClassificationReport {
  protected predictions: number[]
  protected actuals: number[]
  static MultiClass: typeof MultiClass

  constructor({
    predictions,
    actuals,
  }: {
    predictions: number[],
    actuals: number[],
  }) {
    this.predictions = predictions
    this.actuals = actuals
  }

  getAccuracy({
    TP = this.getTP(),
    TN = this.getTN(),
    FP = this.getFP(),
    FN = this.getFN(),
  }: {
    TP?: number,
    TN?: number,
    FP?: number,
    FN?: number,
  } = {}) {
    return (TP + TN) / (TP + TN + FP + FN)
  }

  getPrecision({
    TP = this.getTP(),
    FP = this.getFP(),
  }: {
    TP?: number,
    FP?: number,
  } = {}) {
    return TP / (TP + FP)
  }

  getRecall({
    TP = this.getTP(),
    FN = this.getFN(),
  }: {
    TP?: number,
    FN?: number,
  } = {}) {
    return TP / (TP + FN)
  }

  getF1({
    precision = this.getPrecision(),
    recall = this.getRecall(),
  }: {
    precision?: number,
    recall?: number,
  } = {}) {
    return 2 * precision * recall / (precision + recall)
  }

  getTP({
    predictions = this.predictions,
    actuals = this.actuals,
    category,
  }: {
    predictions?: number[],
    actuals?: number[],
    category?: number,
  } = {}) {
    return predictions.reduce((acc, prediction, i) => {
      return acc + (prediction === actuals[i] && prediction === category ? 1 : 0)
    }, 0)
  }

  getFP({
    predictions = this.predictions,
    actuals = this.actuals,
    category,
  }: {
    predictions?: number[],
    actuals?: number[],
    category?: number,
  } = {}) {
    return predictions.reduce((acc, prediction, i) => {
      return acc + (prediction !== actuals[i] && prediction === category ? 1 : 0)
    }, 0)
  }

  getFN({
    predictions = this.predictions,
    actuals = this.actuals,
    category,
  }: {
    predictions?: number[],
    actuals?: number[],
    category?: number,
  } = {}) {
    return predictions.reduce((acc, prediction, i) => {
      return acc + (prediction !== actuals[i] && actuals[i] === category ? 1 : 0)
    }, 0)
  }

  getTN({
    predictions = this.predictions,
    actuals = this.actuals,
    category,
  }: {
    predictions?: number[],
    actuals?: number[],
    category?: number,
  } = {}) {
    return predictions.reduce((acc, prediction, i) => {
      return acc + (prediction !== actuals[i] && actuals[i] !== category ? 1 : 0)
    }, 0)
  }
}

class MultiClass extends ClassificationReport {
  private classes: number[]

  constructor({
    predictions,
    actuals,
  }: {
    predictions: number[],
    actuals: number[],
  }) {
    super({ predictions, actuals })
    this.classes = Array.from(new Set(actuals))
  }
  
  getSummary() {
    // classes is unique actuals
    const classes = [...new Set(this.predictions)]
    
    const summary = classes.map((c) => {
      const TP = this.getTP({ predictions: this.predictions, actuals: this.actuals, category: c })
      const FP = this.getFP({ predictions: this.predictions, actuals: this.actuals, category: c })
      const FN = this.getFN({ predictions: this.predictions, actuals: this.actuals, category: c })
      const TN = this.getTN({ predictions: this.predictions, actuals: this.actuals, category: c })
      
      const accuracy = this.getAccuracy({ TP, TN, FP, FN })
      const precision = this.getPrecision({ TP, FP })
      const recall = this.getRecall({ TP, FN })
      const f1 = this.getF1({ precision, recall })

      return {
        class: c,
        accuracy,
        precision,
        recall,
        f1,
      }
    })

    return summary
  }

  print() {
    const summary = this.getSummary()
    console.table(summary)
  }
}

ClassificationReport.MultiClass = MultiClass

export { MultiClass }

export default ClassificationReport