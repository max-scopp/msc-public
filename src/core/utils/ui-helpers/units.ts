export function getRemBase() {
  return parseInt(getComputedStyle(document.documentElement)['font-size'], 10);
}

export function numToRem(numericValue: number) {
  return `${numericValue / getRemBase()}rem`;
}