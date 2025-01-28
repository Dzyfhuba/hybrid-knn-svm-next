import { describe, it, expect } from 'vitest'
import SVM from './svm'

describe('Linear', () => {
  it('should initialize with default parameters', () => {
    const model = new SVM.Linear({})
    expect(model).toBeDefined()
  })

  it('should fit the model correctly', () => {
    const model = new SVM.Linear({})
    const X = [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ]
    const y = [1, 1, -1, -1]
    model.fit(X, y)
    const history = model.getHistory()
    expect(history.weights.length).toBeGreaterThan(0)
    expect(history.bias.length).toBeGreaterThan(0)
    expect(history.lost.length).toBeGreaterThan(0)
  })

  it('should predict correctly', () => {
    const model = new SVM.Linear({})
    const X = [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ]
    const y = [1, 1, -1, -1]
    model.fit(X, y)
    const predictions = model.predict(X)
    expect(predictions).toEqual([1, 1, -1, -1])
  })

  it('should calculate the decision function correctly', () => {
    const model = new SVM.Linear({})
    const X = [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ]
    const y = [1, 1, -1, -1]
    model.fit(X, y)
    const decisionValues = model.decisionFunction(X)
    expect(decisionValues.length).toBe(X.length)
  })

  it('should calculate the loss correctly', () => {
    const model = new SVM.Linear({})
    const X = [
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
    ]
    const y = [1, 1, -1, -1]
    model.fit(X, y)
    const loss = model.loss(X, y)
    expect(loss).toBeGreaterThan(0)
  })
})