import { BinaryStruct } from "./interfaces";
import { isArray } from "./isArray";
import { isPureObject } from "./isPureObject";

/**
 * Merge options
 */
interface IMergeOptions {
  /**
   * Toggles whether or not to create a new object when copying objects.
   * 
   * Prevents mutating the `object1` from `object2` after the merging is 
   * complete.
   * 
   * @default false
   */
  createNewObject: boolean;
}

/**
 * Merges `object2` with `object1`
 * 
 * Note that objects such as `Date` won't work with this function.
 * 
 * @param {object} object1 The first object
 * 
 * Note that the first object is **modified**.
 * @param {object} object2 The second object
 * @param {IMergeOptions} options
 * 
 * @returns {void}
 */
export function merge(
  object1: {
    [key: string]: any;
  },
  object2: {
    [key: string]: any;
  },
  options: IMergeOptions = {
    createNewObject: false,
  }
): void {
  // get the keys of both the objects
  const keys: BinaryStruct<string[]> = {
    left: Object.keys(object1),
    right: Object.keys(object2),
  };

  // create a `Set' from those keys
  const keysSet: Set<string> = new Set<string>([...keys.left, ...keys.right]);

  // go through each key in `keysSet'
  for (const key of keysSet) {
    // the following constant can have 3 values:
    // 1. `0` if both objects have `key`
    // 2. `1` if only object 1 has `key`
    // 3. `2` if only object 2 has `key`
    const hasKey: number =
      key in object1 && key in object2 ? 0 : key in object1 ? 1 : 2;

    if (hasKey === 1) {
      // nothing to do; `continue`
      continue;
    } else if (hasKey === 2) {
      // if `object2[key]` is an array...
      if (isArray(object2[key])) {
        // ... then create an array on `object1[key]` with the contents of
        // `object2[key]`
        object1[key] = [...object2[key]];
      } else if (options.createNewObject && isPureObject(object2[key])) {
        // ... but if it's a pure object **and** `options.createNewObject` is
        // `true`, then clone `object2[key]` and assign the new object to
        // `object1[key]`
        //
        // this is done to prevent mutating `object1` from `object2` in other
        // parts of the code
        object1[key] =  { ...object2[key] };
      } else {
        // ... otherwise, simply set `object1[key]` to `object2[key]`
        object1[key] = object2[key];
      }
    } else if (hasKey === 0) {
      // if `object1[key]` and `object2[key]` are both arrays...
      if (isArray(object1[key]) && isArray(object2[key])) {
        // ... then merge the two arrays
        object1[key].push(...object2[key]);
      } else if (isPureObject(object1[key]) && isPureObject(object2[key])) {
        // ... but if they're both objects, run `merge` on them again
        // ... and also forward the options received
        merge(object1[key], object2[key], options);
      } else {
        // ... otherwise, simply set `object1[key]` to `object2[key]`
        object1[key] = object2[key];
      }
    }
  }
}
