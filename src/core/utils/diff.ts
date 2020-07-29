/* eslint-disable no-duplicate-case */
/* eslint-disable no-fallthrough */
import { AnyObject } from '../definitions';

export enum TouchResult {
  NoChange,
  Length,
  Literal
}

/**
 * As the name suggest, it's _touches_ both "a" and "b" items
 * and returns "true" as soon as anything has a meaningful change.
 * NOTE: Array and Object's are only checked against value changes
 *  by the keys from argument "a". Make sure the first one will be the incoming state.
 * TODO: Reverse the loops? This function isn't slow, yet.
 */
export function touchForChange<T = AnyObject | Array<any>>(a: T, b: T, nowTime = true): TouchResult {
  // we will look for these types later.
  const aType = typeof a;
  const bType = typeof b;

  // TODO: Remove at some point
  let startTime: any = nowTime;
  if (nowTime === true) {
    startTime = performance.now();
  }

  // special js-specific edge-case.
  // If either a or b are either undefined or null,
  // the comparitation can be done in a simplified manner.

  if (
    (aType === 'undefined' || bType === 'undefined')
    || (a === null || b === null)) {
    return a !== b ? TouchResult.Literal : TouchResult.NoChange;
  }

  // every OTHER type apart undefined and null has to be the same.
  // e.g. A pure object holding an array cannot change to an nexsted pure object.
  if (aType !== bType) {
    throw new TypeError('Cannot touch for change. Type "a" is different from "b".');
  }

  // I love switches! (clickity clack)
  // THIS IS A FALLTHRU SWITCH! (see missing breaks)
  switch (aType) {
    case 'symbol': // let's not talk about symbols.
      throw new Error('Cannot differenciate between Symbols.');
    case 'string':
    case 'number':
    case 'boolean':
    case 'function':
      // type literals can be differantiated in a simplified manner.
      // A new function assignment means a change.
      // Stupid idea, but let's say we store an (fat) arrow function
      // in our state. Then, this means every state-change
      // a new function reference will be associated with that state.
      // However, if you use a named function and point your state to that
      // reference, the literal type check will pass, as it's still holding the
      // same reference.
      if (a !== b) {
        return TouchResult.Literal;
      }
    case 'object': {
      if (a instanceof Array) {
        // gonna re-type "b" because "type assurance by type dependency" would
        // slow the function down and both edge-cases
        // (falsy and meaningful difference) are handled above already.
        if (a.length !== (b as unknown as any[]).length) {
          console.log('ALength', { time: `${performance.now() - startTime}ms` });
          return TouchResult.Length;
        }

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < a.length; i++) {
          const aItem = a[i];
          const bItem = b[i];

          const result = touchForChange(aItem, bItem, startTime);
          if (result) {
            console.log('a changed to b', { time: `${performance.now() - startTime}ms`, aItem, bItem });
            return result;
          }
        }
      } else if (aType === 'object') {
        const keys = Object.keys(a);
        const bKeys = Object.keys(b);

        if (keys.length !== bKeys.length) {
          console.log('OLength.', { time: `${performance.now() - startTime}ms` });

          return TouchResult.Length;
        }

        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const aItem = a[key];
          const bItem = b[key];

          const result = touchForChange(aItem, bItem, startTime);
          if (result) {
            console.log('a changed to b', { time: `${performance.now() - startTime}ms`, aItem, bItem });
            return result;
          }
        }
      }
    }
    // looks like every single test above failed.
    default: {
      return TouchResult.NoChange;
    }
  }
}
