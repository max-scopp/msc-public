import { numToRem } from "./units";

/**
 * Checks if a string could likely be a number.
 * Also allows for various formats and mathmetical expressions.
 * @param likelyStringNumber
 */
export function unitlessNumericString(likelyStringNumber) {
  return /^[\d,.e+-]*$/.test(likelyStringNumber);
}

export function numericString(likelyStringNumber, knownUnit) {
  if (knownUnit) {
    if (likelyStringNumber.endsWith(knownUnit)) {
      const withoutKnownUnit = likelyStringNumber.substring(0, likelyStringNumber.length - knownUnit.length);
      return unitlessNumericString(withoutKnownUnit)
    }
    return false;
  }

  // TODO: Implement options. Give the possible to return the detected unit instead.
  const [fullMatch, actualNumericValue, endingUnit] = (/([\d,.e+-]*)(\w*)$/).exec(likelyStringNumber);

  return unitlessNumericString(actualNumericValue);
}

/**
 * Converts anything into some value to be used inside CSS as variable or direct
 * variable assignment.
 * @example numberLikeCSSValue('10') => '0.1rem'
 * @example numberLikeCSSValue(10) => '0.1rem'
 * @example numberLikeCSSValue('10px') => '10px'
 */
export function numberLikeCSSValue(likelyAnyNumberRepresentation: string | number) {
  if (typeof likelyAnyNumberRepresentation === 'string') {
    if (unitlessNumericString(likelyAnyNumberRepresentation)) {
      return numToRem(parseInt(likelyAnyNumberRepresentation, 10));
    }

    return likelyAnyNumberRepresentation;
  }

  return numToRem(likelyAnyNumberRepresentation);
}
