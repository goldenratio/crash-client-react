/**
 * Random integer between min and max. Includes min and max value
 * @param min
 * @param max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random float between min and max. Inclusive min, exclusive max
 * @param min
 * @param max
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Get float with two decimals rounding form float/integer value
 * @param value
 */
export function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
