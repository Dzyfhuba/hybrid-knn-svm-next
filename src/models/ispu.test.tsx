import { describe, it, expect } from 'vitest'
import ISPU from './ispu'

describe('ISPU', () => {
  describe('calculate', () => {
    it('should calculate ISPU for pm10 correctly', () => {
      const result = ISPU.calculate(100, 'pm10')
      expect(result).toBeCloseTo(75.2525)
    })

    it('should throw an error for negative concentration', () => {
      expect(() => ISPU.calculate(-10, 'pm10')).toThrow('Concentration cannot be negative')
    })

    it('should calculate ISPU for so2 correctly', () => {
      const result = ISPU.calculate(500, 'so2')
      expect(result).toBeCloseTo(69.2981)
    })

    it('should calculate ISPU for co correctly', () => {
      const result = ISPU.calculate(10, 'co')
      expect(result).toBeCloseTo(100)
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
    it('should calculate summary ISPU correctly for given data', () => {
      const data = {
        pm10: 94,
        pm2_5: 135,
        so2: 46,
        co: 29,
        o3: 74,
        no2: 44,
      }
      const summary = ISPU.calculateSummaryWithLabel(data)
      expect(summary).toBe('TIDAK SEHAT')

      const data2 = {
        pm10: 54,
        pm2_5: 73,
        so2: 56,
        co: 24,
        o3: 23,
        no2: 24,
      }

      const summary2 = ISPU.calculateSummaryWithLabel(data2)
      expect(summary2).toBe('SEDANG')

      const data3 = {
        pm10: 27,
        pm2_5: 50,
        so2: 44,
        co: 11,
        o3: 17,
        no2: 12,
      }

      const summary3 = ISPU.calculateSummaryWithLabel(data3)
      expect(summary3).toBe('BAIK')
    })
  })
})