import DateValidator from './validators/date';
import NumberValidator from './validators/number';
import TextValidator from './validators/text';
import { ValidationTypes } from './validators/types';

export { ValidationTypes } from './validators/types';


export const validatorImplementationsMap = new Map<ValidationTypes, Validator>([
  TextValidator,
  NumberValidator,
  DateValidator,
] as any);

/**
 * TODO: Implement validation types, preferrably use
 * https://validatejs.org/
 */
export function validationCreator(type: ValidationTypes) {
  if (validatorImplementationsMap.has(type)) {
    return validatorImplementationsMap.get(type);
  }
  throw new Error(`Cannot find Validator ${ValidationTypes[type]}`);
}

export type ValidationConflict = any; // not needed, for now.
export type ValidationResult = boolean | Array<ValidationConflict>;
export type Validator = <T>(value: T) => ValidationResult;
