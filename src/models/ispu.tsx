/**
 * Class representing the ISPU (Indeks Standar Pencemar Udara) model.
 */
class ISPU {
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
  static calculate(real : number, element: 'pm10' | 'pm2_5' | 'so2' | 'co' | 'o3' | 'no2'): number {
    if (real < 0) {
      throw new Error('Concentration cannot be negative')
    }

    let indexLower = 1
    let indexUpper = 50
    let concentrationLower = 1
    let concentrationUpper = 50

    const standards = {
      pm10: [
        { indexLower: 1, indexUpper: 50, concentrationLower: 0, concentrationUpper: 50 },
        { indexLower: 51, indexUpper: 100, concentrationLower: 51, concentrationUpper: 150 },
        { indexLower: 101, indexUpper: 200, concentrationLower: 151, concentrationUpper: 350 },
        { indexLower: 201, indexUpper: 300, concentrationLower: 351, concentrationUpper: 420 },
        { indexLower: 301, indexUpper: 500, concentrationLower: 421, concentrationUpper: 500 }
      ],
      pm2_5: [
        { indexLower: 1, indexUpper: 50, concentrationLower: 0, concentrationUpper: 25 },
        { indexLower: 51, indexUpper: 100, concentrationLower: 26, concentrationUpper: 65 },
        { indexLower: 101, indexUpper: 200, concentrationLower: 66, concentrationUpper: 125 },
        { indexLower: 201, indexUpper: 300, concentrationLower: 126, concentrationUpper: 250 },
        { indexLower: 301, indexUpper: 500, concentrationLower: 251, concentrationUpper: 500 }
      ],
      so2: [
        { indexLower: 1, indexUpper: 50, concentrationLower: 0, concentrationUpper: 350 },
        { indexLower: 51, indexUpper: 100, concentrationLower: 351, concentrationUpper: 750 },
        { indexLower: 101, indexUpper: 200, concentrationLower: 751, concentrationUpper: 1250 },
        { indexLower: 201, indexUpper: 300, concentrationLower: 1251, concentrationUpper: 1850 },
        { indexLower: 301, indexUpper: 500, concentrationLower: 1851, concentrationUpper: 5000 }
      ],
      co: [
        { indexLower: 1, indexUpper: 50, concentrationLower: 0, concentrationUpper: 5 },
        { indexLower: 51, indexUpper: 100, concentrationLower: 6, concentrationUpper: 10 },
        { indexLower: 101, indexUpper: 200, concentrationLower: 11, concentrationUpper: 17 },
        { indexLower: 201, indexUpper: 300, concentrationLower: 18, concentrationUpper: 34 },
        { indexLower: 301, indexUpper: 500, concentrationLower: 35, concentrationUpper: 50 }
      ],
      o3: [
        { indexLower: 1, indexUpper: 50, concentrationLower: 0, concentrationUpper: 100 },
        { indexLower: 51, indexUpper: 100, concentrationLower: 101, concentrationUpper: 200 },
        { indexLower: 101, indexUpper: 200, concentrationLower: 201, concentrationUpper: 300 },
        { indexLower: 201, indexUpper: 300, concentrationLower: 301, concentrationUpper: 400 },
        { indexLower: 301, indexUpper: 500, concentrationLower: 401, concentrationUpper: 800 }
      ],
      no2: [
        { indexLower: 1, indexUpper: 50, concentrationLower: 0, concentrationUpper: 100 },
        { indexLower: 51, indexUpper: 100, concentrationLower: 101, concentrationUpper: 200 },
        { indexLower: 101, indexUpper: 200, concentrationLower: 201, concentrationUpper: 700 },
        { indexLower: 201, indexUpper: 300, concentrationLower: 701, concentrationUpper: 1200 },
        { indexLower: 301, indexUpper: 500, concentrationLower: 1201, concentrationUpper: 2000 }
      ]
    }

    const standard = standards[element].find(
      ({ concentrationLower, concentrationUpper }) => real >= concentrationLower && real <= concentrationUpper
    )
    console.log(element, standard)
    if (!standard) {
      throw new Error(`Concentration ${real} is not within the specified bounds, ${element}`)
    }

    if (standard) {
      indexLower = standard.indexLower
      indexUpper = standard.indexUpper
      concentrationLower = standard.concentrationLower
      concentrationUpper = standard.concentrationUpper
    }

    return (indexUpper - indexLower) / (concentrationUpper - concentrationLower) * (real - concentrationLower) + indexLower
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
    if (ispu >= 0 && ispu <= 50) {
      return 'BAIK'
    } else if (ispu > 50 && ispu <= 100) {
      return 'SEDANG'
    } else if (ispu > 100 && ispu <= 199) {
      return 'TIDAK SEHAT'
    } else if (ispu > 199 && ispu <= 299) {
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
  static calculateSummaryWithLabel(data: { [key: string]: number
  }): 'BAIK' | 'SEDANG' | 'TIDAK SEHAT' | 'SANGAT TIDAK SEHAT' | 'BERBAHAYA' {
    console.log(data)
    const result = Object.entries(data).map(([element, concentration]) => ISPU.calculate(concentration, element as 'pm10' | 'pm2_5' | 'so2' | 'co' | 'o3' | 'no2'))
    const average = result.reduce((acc, curr) => acc + curr, 0) / result.length
    return ISPU.getLabel(average)
  }
}

export default ISPU