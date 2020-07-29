import { ValidationTypes } from "./types";

export default [
  ValidationTypes.Number,
  (value) => {
    return !isNaN(parseInt(value, 10))
  }
]