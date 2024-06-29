export default interface SplitData{
  trainFeatures: number[][];
  trainLabels: (1 | 2 | 3)[];
  testFeatures: number[][];
  testLabels: (1 | 2 | 3)[];
}