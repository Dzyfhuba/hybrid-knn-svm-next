class KNN {
  private k: number
  private X_train: number[][] = []
  private y_train: number[] = []
  private distance_records: number[][] = []
  private k_indices_records: number[][] = []
  private k_nearest_labels_records: number[][] = []
  private most_common_records: number[] = []

  constructor(k: number = 3) {
    this.k = k
  }

  fit(X: number[][], y: number[]): void {
    this.X_train = X
    this.y_train = y
  }

  predict(X: number[][]): number[] {
    return X.map(x => this._predict(x))
  }

  private _predict(x: number[]): number {
    const distances = this.X_train.map(x_train => this._euclidean_distance(x, x_train))
    this.distance_records.push(distances)

    const kIndices = this.argsort(distances).slice(0, this.k)
    this.k_indices_records.push(kIndices)

    const kNearestLabels = kIndices.map(i => this.y_train[i])
    this.k_nearest_labels_records.push(kNearestLabels)

    const mostCommon = this.mode(kNearestLabels)
    this.most_common_records.push(mostCommon)

    return mostCommon
  }

  private _euclidean_distance(x1: number[], x2: number[]): number {
    return Math.sqrt(x1.reduce((sum, val, i) => sum + Math.pow(val - x2[i], 2), 0))
  }

  private argsort(array: number[]): number[] {
    return array
      .map((value, index) => ({ value, index }))
      .sort((a, b) => a.value - b.value)
      .map(({ index }) => index)
  }

  private mode(array: number[]): number {
    const count: { [key: number]: number } = {}
    array.forEach(num => {
      count[num] = (count[num] || 0) + 1
    })
    return +Object.keys(count).reduce((a, b) => count[+a] > count[+b] ? a : b)
  }

  getDistanceRecords(): number[][] {
    return this.distance_records
  }

  getKIndicesRecords(): number[][] {
    return this.k_indices_records
  }

  getKNearestLabelsRecords(): number[][] {
    return this.k_nearest_labels_records
  }

  getMostCommonRecords(): number[] {
    return this.most_common_records
  }
}

// Example usage:
// const knn = new KNN(3);
// knn.fit([[1, 2], [2, 3], [3, 4]], [0, 1, 0]);
// const predictions = knn.predict([[1.5, 2.5]]);
// console.log(predictions); // Output: [0]

export default KNN