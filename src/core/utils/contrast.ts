import { AppTheme } from '../definitions';
import { Build } from '@stencil/core';

export enum TextContrastResult {
  Light,
  Dark
}

/**
 * Only apply text-color if it deviates from the current theme type.
 * Apply if result is light, but theme is dark.
 */
export const lightTheme = (lightness: TextContrastResult) => {
  return lightness === TextContrastResult.Dark && ApplicationService.theme === AppTheme.Light;
};

/**
 * Only apply text-color if it deviates from the current theme type.
 * Apply if result is dark, but theme is light.
 */
export const darkTheme = (lightness: TextContrastResult) => {
  return lightness === TextContrastResult.Light && ApplicationService.theme === AppTheme.Dark;
};

/**
 * Returns a brightnes value between 0-255
 * If the background is partially transparent, null is returned.
 */
export function getBackgroundBrightnessFor(element: HTMLElement) {
  const rgbParts = getComputedStyle(element)
    .getPropertyValue('background-color')
    .match(/[\d.]{1,3}/gi);

  const [red, green, blue, alphaFloat = 0] = rgbParts
    ? rgbParts.map((num) => parseFloat(num))
    : [];

  const rgb = [red, green, blue];
  const alpha = parseFloat(`${alphaFloat}0000`);

  if (!red && !green && !blue && !alpha) {
    return null;
  }

  // http://www.w3.org/TR/AERT#color-contrast
  const perceivedBrightness = Math.round(
    (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000,
  );

  // only used when there is a correct alpha value
  const correctedBrightness = perceivedBrightness * alpha;

  if (Build.isDev) {
    LoggerService.group(
      `%c   %c   %c ${perceivedBrightness}/255${alpha ? `; corrected: ${correctedBrightness}/255 ` : ''}`,
      (logger) => {
        logger.info(element);
      },
      `background: rgba(${red}, ${green}, ${blue}, 1)`,
      `background: rgba(${[red, green, blue, alpha || 1]})`,
      'background: initial',
    );
  }

  if (alpha) {
    return correctedBrightness;
  }

  return perceivedBrightness;
}

// it's not that critical for the application, but for the function
// to prevent infinite calculations, which is bad.
const CRITICAL_LIMIT = 10;

let realCalls = 0;
export function ensureColorContrastFor(
  element: HTMLElement,
  forcefully = false,
  applyIf: (lightness) => boolean = () => true,
  recursionDepth = 0,
) {
  if (recursionDepth > CRITICAL_LIMIT) {
    LoggerService.warn(
      'Too many tries to decide contrast, is it fully transparent? rgba(0,0,0,0) (element logged above)',
    );
    return;
  } if (!recursionDepth) {
    // eslint-disable-next-line no-plusplus
    realCalls++;
  }

  requestAnimationFrame(() => {
    const lightness = getBackgroundBrightnessFor(element);

    if (!lightness) {
      const nextTime = 2 ** recursionDepth;

      if (document.readyState === 'complete') {
        LoggerService.error(
          'Element is likely to be transparent, because the assets have finished loading! (element logged above)',
        );
        return;
      }

      console.warn(`Delay to decide color contrast in the frame queue that will occour in ${nextTime}ms. #${realCalls}`);

      // eslint-disable-next-line
      recursionDepth++;

      setTimeout(() => {
        ensureColorContrastFor(element, forcefully, applyIf, recursionDepth);
      }, nextTime);
    } else {
      const result = lightness <= 127 ? TextContrastResult.Dark : TextContrastResult.Light;

      if (applyIf(result) === true) {
        element.style.setProperty(
          forcefully ? 'color' : '--color',
          result === TextContrastResult.Dark
            ? 'var(--text-on-dark)'
            : 'var(--text-on-light)',
        );
      }
    }
  });
}
