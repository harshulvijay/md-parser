/**
 * Checks if the given input is an array.
 *
 * @param {any} input The input to perform the type checks on
 *
 * @returns {boolean} `true` if the given input is an array; `false` otherwise.
 */
export function isArray(input: any): boolean {
  return typeof input === "object" && Array.isArray(input);
}
