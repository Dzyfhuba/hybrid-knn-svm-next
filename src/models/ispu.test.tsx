import { describe, it, expect } from 'vitest'
import ISPU from './ispu'

describe('ISPU', () => {
  describe('calculate', () => {
    it('should calculate ISPU for pm10 correctly', () => {
      const result = ISPU.calculate(100, 'pm10')
      expect(result).toBeCloseTo(75)
    })

    it('should throw an error for negative concentration', () => {
      expect(() => ISPU.calculate(-10, 'pm10')).toThrow('Concentration cannot be negative')
    })

    it('should calculate ISPU for so2 correctly', () => {
      const result = ISPU.calculate(500, 'so2')
      expect(result).toBeCloseTo(225)
    })

    it('should calculate ISPU for co correctly', () => {
      const result = ISPU.calculate(10, 'co')
      expect(result).toBeCloseTo(70)
    })
  })

  describe('getLabel', () => {
    it('should return BAIK for ISPU value between 0 and 50', () => {
      const result = ISPU.getLabel(50)
      expect(result).toBe('BAIK')
    })

    it('should return SEDANG for ISPU value between 51 and 100', () => {
      const result = ISPU.getLabel(75)
      expect(result).toBe('SEDANG')
    })

    it('should return TIDAK SEHAT for ISPU value between 101 and 199', () => {
      const result = ISPU.getLabel(150)
      expect(result).toBe('TIDAK SEHAT')
    })

    it('should return SANGAT TIDAK SEHAT for ISPU value between 200 and 299', () => {
      const result = ISPU.getLabel(250)
      expect(result).toBe('SANGAT TIDAK SEHAT')
    })

    it('should return BERBAHAYA for ISPU value 300 and above', () => {
      const result = ISPU.getLabel(350)
      expect(result).toBe('BERBAHAYA')
    })
  })

  describe('calculateSummaryWithLabel', () => {
    it('should calculate summary ISPU correctly for given data set 1', () => {
      const data = {
        pm10: 72,
        pm2_5: 119,
        so2: 58,
        co: 44,
        o3: 53,
        no2: 44,
      }
      const summary = ISPU.calculateSummaryWithLabel(data)
      expect(summary).toBe('SANGAT TIDAK SEHAT')
    })

    it('should calculate summary ISPU correctly for given data set 2', () => {
      const data2 = {
        pm10: 57,
        pm2_5: 85,
        so2: 48,
        co: 13,
        o3: 34,
        no2: 18,
      }
      const summary2 = ISPU.calculateSummaryWithLabel(data2)
      expect(summary2).toBe('TIDAK SEHAT')
    })

    it('should calculate summary ISPU correctly for given data set 3', () => {
      const data3 = {
        pm10: 27,
        pm2_5: 50,
        so2: 44,
        co: 11,
        o3: 17,
        no2: 17,
      }
      const summary3 = ISPU.calculateSummaryWithLabel(data3)
      expect(summary3).toBe('SEDANG')
    })

    it('should calculate summary ISPU correctly for given data set 4', () => {
      const data4 = {
        pm10: 17,
        pm2_5: 30,
        so2: 33,
        co: 8,
        o3: 13,
        no2: 13,
      }
      const summary4 = ISPU.calculateSummaryWithLabel(data4)
      expect(summary4).toBe('SEDANG')
    })

    it('should calculate summary ISPU correctly for given data set 5', () => {
      const data5 = {
        pm10: 7,
        pm2_5: 10,
        so2: 1,
        co: 5,
        o3: 7,
        no2: 7,
      }
      const summary5 = ISPU.calculateSummaryWithLabel(data5)
      expect(summary5).toBe('BAIK')
    })
  })
})