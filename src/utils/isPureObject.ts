/**
 * Checks if the given input is a 'pure' object.
 * 'Pure' here refers to any object that isn't `null`.
 *
 * @param {any} input The input to perform the type checks on
 *
 * @returns {boolean} `true` if the given input is a 'pure' object;
 * `false` otherwise
 */
export function isPureObject(input: any): boolean {
  return typeof input === "object" && !Array.isArray(input) && input !== null;
}
