export const CRITERION = [
  'pm10',
  'pm2_5',
  'so2',
  'co',
  'o3',
  'no2',
] as const
export type Criterion = typeof CRITERION[number]

export const KUALITAS = [
  'BAIK',
  'SEDANG',
  'TIDAK SEHAT',
  'SANGAT TIDAK SEHAT',
  'BERBAHAYA',
]

export type Kualitas = typeof KUALITAS[number]
