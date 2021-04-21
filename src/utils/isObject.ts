/**
 * Checks if the given input is an object.
 *
 * @param {any} input The input to perform the type check on
 *
 * @returns {boolean} `true` if the given input is an object; `false` otherwise
 */
export function isObject(input: any): boolean {
  return typeof input === "object";
}
