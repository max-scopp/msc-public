import { ValidationTypes } from "./types";

export default [
  ValidationTypes.Text,
  (value) => {
    if (typeof value === 'string' && value.length) {
      return true
    }

    return false;
  }
]