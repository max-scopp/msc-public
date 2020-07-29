import { ValidationTypes } from "./types";

function isValidDateInstance(dateInstance: Date) {
  if (!isNaN(dateInstance.getTime())) {
    // we have a valid date format
    return true;
  }

  return false;
}

export default [
  ValidationTypes.Date,
  (value: string | Date | any) => {
    // it's a string? possibly ISO 8601
    // it's a number? likely an unix timestamp
    if ((typeof value === 'string' || typeof value === 'number') && String(value).length) {
      const parsedDate = new Date(value);
      return isValidDateInstance(parsedDate)
    } else if (value instanceof Date) {
      return isValidDateInstance(value);
    }

    return false;
  }
]