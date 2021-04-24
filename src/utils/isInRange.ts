/**
 * Options for `isInRange()`
 */
interface IIsInRangeOptions {
  /**
   * If set to `true`, checks if `min` <= `num` instead of `min` < `num`
   *
   * @default false
   */
  bottom?: boolean;

  /**
   * If set to `true`, checks if `num` <= `max` instead of `num` < `max`
   *
   * @default false
   */
  top?: boolean;
}

/**
 * Checks if the given number `num` is between `min` and `max`.
 *
 * @param {number} num The number to compare
 * @param {number} min The minimum number to compare with
 * 
 * Default: `-Infinity`
 * @param {number} max The maximum number to compare with
 * 
 * Default: `Infinity`
 * @param {IIsInRangeOptions} options Options
 *
 * @returns {boolean} `true` if `min` < `num` < `max`; `false` otherwise
 */
export function isInRange(
  num: number,
  min: number = -Infinity,
  max: number = Infinity,
  options: IIsInRangeOptions = { top: false, bottom: false }
): boolean {
  // throw an error if `min` >= `max`
  if (min >= max) {
    throw new RangeError(`'min' should be less than 'max'`);
  }

  const minCondition = options.bottom ? min <= num : min < num;
  const maxCondition = options.top ? num <= max : num < max;

  return minCondition && maxCondition;
}
