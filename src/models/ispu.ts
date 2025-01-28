import type { Criterion, Kualitas } from '@/types/criterion'

/**
 * Class representing the ISPU (Indeks Standar Pencemar Udara) model.
 */
class ISPU {
  static standards = {
    pm10: [
      { indexLower: 0, indexUpper: 50, concentrationLower: 0, concentrationUpper: 50 },
      { indexLower: 50, indexUpper: 100, concentrationLower: 50, concentrationUpper: 150 },
      { indexLower: 100, indexUpper: 200, concentrationLower: 150, concentrationUpper: 350 },
      { indexLower: 200, indexUpper: 300, concentrationLower: 350, concentrationUpper: 420 },
      { indexLower: 300, indexUpper: null, concentrationLower: 420, concentrationUpper: 500, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 420, alternativeConcenUpper: 500 },
      { indexLower: null, indexUpper: null, concentrationLower: 500, concentrationUpper: null,  alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 420, alternativeConcenUpper: 500 },
    ],
    pm2_5: [
      { indexLower: 0, indexUpper: 50, concentrationLower: 0, concentrationUpper: 15.5 },
      { indexLower: 50, indexUpper: 100, concentrationLower: 15.5, concentrationUpper: 55.4 },
      { indexLower: 100, indexUpper: 200, concentrationLower: 55.4, concentrationUpper: 150.4 },
      { indexLower: 200, indexUpper: 300, concentrationLower: 150.4, concentrationUpper: 250.4 },
      { indexLower: 300, indexUpper: null, concentrationLower: 250.4, concentrationUpper: 500, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 250.4, alternativeConcenUpper: 500 },
      { indexLower: null, indexUpper: null, concentrationLower: 500, concentrationUpper: null, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 250.4, alternativeConcenUpper: 500 },
    ],
    so2: [
      { indexLower: 0, indexUpper: 50, concentrationLower: 0, concentrationUpper: 52 },
      { indexLower: 50, indexUpper: 100, concentrationLower: 52, concentrationUpper: 180 },
      { indexLower: 100, indexUpper: 200, concentrationLower: 180, concentrationUpper: 400 },
      { indexLower: 200, indexUpper: 300, concentrationLower: 400, concentrationUpper: 800 },
      { indexLower: 300, indexUpper: null, concentrationLower: 800, concentrationUpper: 1200, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 800, alternativeConcenUpper: 1200 },
      { indexLower: null, indexUpper: null, concentrationLower: 1200, concentrationUpper: null,  alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 800, alternativeConcenUpper: 1200 },
    ],
    co: [
      { indexLower: 0, indexUpper: 50, concentrationLower: 0, concentrationUpper: 8 },
      { indexLower: 50, indexUpper: 100, concentrationLower: 8, concentrationUpper: 13 },
      { indexLower: 100, indexUpper: 200, concentrationLower: 13, concentrationUpper: 25 },
      { indexLower: 200, indexUpper: 300, concentrationLower: 25, concentrationUpper: 40 },
      { indexLower: 300, indexUpper: null, concentrationLower: 40, concentrationUpper: 60, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 40, alternativeConcenUpper: 60 },
      { indexLower: null, indexUpper: null, concentrationLower: 60, concentrationUpper: null, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 40, alternativeConcenUpper: 60 },
    ],
    // co: [
    //   { indexLower: 0, indexUpper: 50, concentrationLower: 0, concentrationUpper: 4 },
    //   { indexLower: 50, indexUpper: 100, concentrationLower: 4, concentrationUpper: 8 },
    //   { indexLower: 100, indexUpper: 200, concentrationLower: 8, concentrationUpper: 15 },
    //   { indexLower: 200, indexUpper: 300, concentrationLower: 15, concentrationUpper: 30 },
    //   { indexLower: 300, indexUpper: null, concentrationLower: 30, concentrationUpper: 45, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 30, alternativeConcenUpper: 45 },
    //   { indexLower: null, indexUpper: null, concentrationLower: 45, concentrationUpper: null, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 30, alternativeConcenUpper: 45 },
    // ],
    o3: [
      { indexLower: 0, indexUpper: 50, concentrationLower: 0, concentrationUpper: 120 },
      { indexLower: 50, indexUpper: 100, concentrationLower: 120, concentrationUpper: 235 },
      { indexLower: 100, indexUpper: 300, concentrationLower: 235, concentrationUpper: 400 },
      { indexLower: 100, indexUpper: 200, concentrationLower: 400, concentrationUpper: 800 },
      { indexLower: 300, indexUpper: null, concentrationLower: 800, concentrationUpper: 1000, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 800, alternativeConcenUpper: 1000 },
      { indexLower: null, indexUpper: null, concentrationLower: 1000, concentrationUpper: null,  alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 800, alternativeConcenUpper: 1000 },
    ],
    no2: [
      { indexLower: 0, indexUpper: 50, concentrationLower: -1, concentrationUpper: 80 },
      { indexLower: 50, indexUpper: 100, concentrationLower: 80, concentrationUpper: 200 },
      { indexLower: 100, indexUpper: 200, concentrationLower: 200, concentrationUpper: 1130 },
      { indexLower: 200, indexUpper: 300, concentrationLower: 1130, concentrationUpper: 2260 },
      { indexLower: 300, indexUpper: null, concentrationLower: 2260, concentrationUpper: 3000, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 2260, alternativeConcenUpper: 3000 },
      { indexLower: null, indexUpper: null, concentrationLower: 3000, concentrationUpper: null, alternativeLower: 200, alternativeUpper: 300, alternativeConcenLower: 2260, alternativeConcenUpper: 3000 },
    ]
  }

  /**
   * Calculates the ISPU (Indeks Standar Pencemar Udara) based on given parameters.
   *
   * @param {Object} params - The parameters for the calculation.
   * @param {number} params.indexLower - The lower bound of the ISPU index.
   * @param {number} params.indexUpper - The upper bound of the ISPU index.
   * @param {number} params.concentrationLower - The lower bound of the ambient concentration.
   * @param {number} params.concentrationUpper - The upper bound of the ambient concentration.
   * @param {number} params.concentrationReal - The actual measured ambient concentration.
   * 
   * @throws {Error} If any of the input values are negative.
   * @throws {Error} If the lower bound is greater than the upper bound.
   * @throws {Error} If the actual concentration is not within the specified bounds.
   * 
   * @returns {number} The calculated ISPU value.
   */
  static calculate(real: number, element: 'pm10' | 'pm2_5' | 'so2' | 'co' | 'o3' | 'no2'): number {
    if (real < 0) {
      throw new Error('Concentration cannot be negative.')
    }
  
    
  
    const standard = this.standards[element].find(({ concentrationLower, concentrationUpper }) => {
      if (concentrationUpper === null) {
        return real >= concentrationLower
      }
      return real >= concentrationLower && real <= concentrationUpper
    })
  
    if (!standard) {
      throw new Error(`Concentration ${real} is not within the bounds for ${element}.`)
    }
  
    let { indexLower, indexUpper, concentrationLower, concentrationUpper } = standard
    const { alternativeLower, alternativeUpper, alternativeConcenLower, alternativeConcenUpper } = standard
  
    // Use alternative values if necessary
    if (concentrationUpper === null || indexUpper === null) {
      indexLower = alternativeLower!
      indexUpper = alternativeUpper!
      concentrationLower = alternativeConcenLower!
      concentrationUpper = alternativeConcenUpper!
    }
  
    // Perform calculation
    const result = ((indexUpper! - indexLower!) / (concentrationUpper! - concentrationLower!)) * (real - concentrationLower!) + indexLower!
  
    return result
  }

  static getStandard(real: number, element: 'pm10' | 'pm2_5' | 'so2' | 'co' | 'o3' | 'no2') {
    const standard = this.standards[element].find(({ concentrationLower, concentrationUpper }) => {
      if (concentrationUpper === null) {
        return real >= concentrationLower
      }
      return real >= concentrationLower && real <= concentrationUpper
    })

    if (!standard) {
      throw new Error(`Concentration ${real} is not within the bounds for ${element}.`)
    }

    let { indexLower, indexUpper, concentrationLower, concentrationUpper } = standard
    const { alternativeLower, alternativeUpper, alternativeConcenLower, alternativeConcenUpper } = standard
  
    // Use alternative values if necessary
    if (concentrationUpper === null || indexUpper === null) {
      indexLower = alternativeLower!
      indexUpper = alternativeUpper!
      concentrationLower = alternativeConcenLower!
      concentrationUpper = alternativeConcenUpper!
    }

    return {
      indexLower,
      indexUpper,
      concentrationLower,
      concentrationUpper
    }
  }

  /**
   * Returns the air quality label based on the given ISPU (Indeks Standar Pencemar Udara) value.
   *
   * @param {number} ispu - The ISPU value to evaluate.
   * @returns {string} The air quality label corresponding to the ISPU value.
   * 
   * Possible return values:
   * - 'BAIK' for ISPU values between 0 and 50 (inclusive).
   * - 'SEDANG' for ISPU values between 51 and 100 (inclusive).
   * - 'TIDAK SEHAT' for ISPU values between 101 and 199 (inclusive).
   * - 'SANGAT TIDAK SEHAT' for ISPU values between 200 and 299 (inclusive).
   * - 'BERBAHAYA' for ISPU values 300 and above.
   */
  static getLabel(ispu: number): 'BAIK' | 'SEDANG' | 'TIDAK SEHAT' | 'SANGAT TIDAK SEHAT' | 'BERBAHAYA' {
    if (0 <= ispu && ispu <= 50) {
      return 'BAIK'
    } else if (ispu <= 100) {
      return 'SEDANG'
    } else if (ispu <= 200) {
      return 'TIDAK SEHAT'
    } else if (ispu <= 300) {
      return 'SANGAT TIDAK SEHAT'
    } else {
      return 'BERBAHAYA'
    }
  }
  
  /**
   * Calculates the summary with a label based on the provided data.
   *
   * @param {Object} params - The parameters object.
   * @param {Object} params.data - An object where keys are pollutant names and values are their concentrations.
   * @returns {string} - The label corresponding to the average concentration.
   */
  static calculateSummaryWithLabel(data: Record<Criterion, number>): Kualitas {
    const result = Object.entries(data).map(([element, concentration]) => {
      const result = ISPU.calculate(concentration, element as 'pm10' | 'pm2_5' | 'so2' | 'co' | 'o3' | 'no2')
      return result
    })
    
    // get largest value
    const max = Math.max(...result)
    return ISPU.getLabel(max)
  }
}

export default ISPU
