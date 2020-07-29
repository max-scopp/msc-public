/* eslint-disable @stencil/ban-side-effects */
import { lazifyKeepElementUpdated } from '../general';
import { numToRem } from './units';

export enum PlacementStrategy {
  None,

  Top,
  TopLeft,
  TopCenter,
  TopRight,

  Right,
  RightTop,
  RightCenter,
  RightBottom,

  Bottom,
  BottomLeft,
  BottomCenter,
  BottomRight,

  Left,
  LeftTop,
  LeftCenter,
  LeftBottom
}

interface AxisResult {
  position: number;
  adjustment: number;
  deviation: number;
  overlap: number;
}

export const strategies: { [key: number]: Strategy } = {};

const AxisType = {
  primary: {
    placements: {
      start: (parentStart, parentLength, childLength, gap) => parentStart - gap - childLength,
      end: (parentStart, parentLength, childLength, gap) => parentStart + parentLength + gap,
    },
    avoidOverlap: true,
  },
  secondary: {
    placements: {
      start: (
        parentStart,
        parentLength,
        childLength,
        gap,
      ) => parentStart,
      end: (
        parentStart,
        parentLength,
        childLength,
        gap,
      ) => parentStart - childLength + parentLength,
      center: (
        parentStart,
        parentLength,
        childLength,
        gap,
      ) => parentStart - childLength / 2 + parentLength / 2,
    },
    avoidOverlap: false,
  },
};

const Direction = {
  horizontal: {
    start: (rect) => rect.left,
    length: (rect) => rect.width,
  },
  vertical: {
    start: (rect) => rect.top,
    length: (rect) => rect.height,
  },
};

/**
 * Adjust the raw (suggested) position to keep the entire popup onscreen.
 */
function adjustPosition(suggestedPosition, childLength, viewportLength) {
  return Math.max(0, Math.min(viewportLength - childLength, suggestedPosition));
}

/**
 * Find the length of overlapping section between two ranges.
 */
function overlappingLength(parentStart, parentLength, childStart, childLength) {
  return Math.max(
    0,
    Math.min(childStart + childLength, parentStart + parentLength)
    - Math.max(childStart, parentStart),
  );
}

function axis(axisType, preferredPlacement) {
  const availableStrategyNames = Object.keys(axisType.placements);
  return {
    calculatePosition(
      parentStart,
      parentLength,
      childLength,
      gap,
      viewportLength,
    ) {
      const results: AxisResult[] = [];
      const preferredPosition = axisType.placements[preferredPlacement](
        parentStart,
        parentLength,
        childLength,
        gap,
      );

      // Try all the possible placements...
      // eslint-disable-next-line no-restricted-syntax
      for (const strategyName of availableStrategyNames) {
        const suggestedPosition = axisType.placements[strategyName](
          parentStart,
          parentLength,
          childLength,
          gap,
        );
        const adjustedPosition = adjustPosition(
          suggestedPosition,
          childLength,
          viewportLength,
        );
        const adjustment = Math.abs(suggestedPosition - adjustedPosition);
        const deviation = Math.abs(preferredPosition - adjustedPosition);
        const overlap = overlappingLength(
          parentStart,
          parentLength,
          adjustedPosition,
          childLength,
        );
        results.push({
          position: adjustedPosition,
          adjustment,
          deviation,
          overlap,
        });
      }
      return results.sort(
        (a, b) =>
          // Prefer a placement that doesn’t require any adjustment...
          // eslint-disable-next-line implicit-arrow-linebreak, @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          (a.adjustment > 0) - (b.adjustment > 0)
          // ...that has the least/most overlapping area...
          || (a.overlap - b.overlap) * (axisType.avoidOverlap ? 1 : -1)
          // ...that is closest to the preferred position...
          || a.deviation - b.deviation
          // ...with minimal amount of adjustment needed to stay fully onscreen
          || a.adjustment - b.adjustment,
      )[0].position;
    },
  };
}

const fallbackPrimaryAxis = axis(AxisType.primary, 'end');
const fallbackSecondaryAxis = axis(AxisType.secondary, 'start');

function createStrategy(xAxis, yAxis): Strategy {
  return (parentRect, childRect, viewportRect, options) => {
    function calculate(direction, currentAxis) {
      return currentAxis.calculatePosition(
        direction.start(parentRect),
        direction.length(parentRect),
        direction.length(childRect),
        options.gap,
        direction.length(viewportRect),
      );
    }
    const suggestedPosition = {
      left: calculate(Direction.horizontal, xAxis),
      top: calculate(Direction.vertical, yAxis),
    };
    const choices = [
      suggestedPosition,
      {
        left: calculate(Direction.horizontal, fallbackSecondaryAxis),
        top: calculate(Direction.vertical, fallbackPrimaryAxis),
      },
      {
        left: calculate(Direction.horizontal, fallbackPrimaryAxis),
        top: calculate(Direction.vertical, fallbackSecondaryAxis),
      },
    ].map((position) => {
      const deviation = (
        position.left - suggestedPosition.left
      ) ** 2 + (
        position.top - suggestedPosition.top
      ) ** 2;

      const overlappedArea = overlappingLength(
        parentRect.left,
        parentRect.width,
        position.left,
        childRect.width,
      )
        * overlappingLength(
          parentRect.top,
          parentRect.height,
          position.top,
          childRect.height,
        );
      return {
        position,
        deviation,
        overlappedArea,
      };
    });

    return choices.sort(
      (a, b) => a.overlappedArea - b.overlappedArea || a.deviation - b.deviation,
    )[0].position;
  };
}

/**
 * Feel free to fix the return type! I'm lazy.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Strategy = (parentRect, childRect, viewportRect, options) => any;

strategies[PlacementStrategy.TopLeft] = createStrategy(
  axis(AxisType.secondary, 'start'),
  axis(AxisType.primary, 'start'),
);

strategies[PlacementStrategy.TopCenter] = createStrategy(
  axis(AxisType.secondary, 'center'),
  axis(AxisType.primary, 'start'),
);

strategies[PlacementStrategy.Top] = strategies[PlacementStrategy.TopCenter];

strategies[PlacementStrategy.TopRight] = createStrategy(
  axis(AxisType.secondary, 'end'),
  axis(AxisType.primary, 'start'),
);

strategies[PlacementStrategy.BottomLeft] = createStrategy(
  axis(AxisType.secondary, 'start'),
  axis(AxisType.primary, 'end'),
);

strategies[PlacementStrategy.BottomCenter] = createStrategy(
  axis(AxisType.secondary, 'center'),
  axis(AxisType.primary, 'end'),
);

strategies[PlacementStrategy.Bottom] = strategies[PlacementStrategy.BottomCenter];

strategies[PlacementStrategy.BottomRight] = createStrategy(
  axis(AxisType.secondary, 'end'),
  axis(AxisType.primary, 'end'),
);

strategies[PlacementStrategy.LeftTop] = createStrategy(
  axis(AxisType.primary, 'start'),
  axis(AxisType.secondary, 'start'),
);

strategies[PlacementStrategy.LeftCenter] = createStrategy(
  axis(AxisType.primary, 'start'),
  axis(AxisType.secondary, 'center'),
);

strategies[PlacementStrategy.Left] = strategies[PlacementStrategy.LeftCenter];

strategies[PlacementStrategy.LeftBottom] = createStrategy(
  axis(AxisType.primary, 'start'),
  axis(AxisType.secondary, 'end'),
);

strategies[PlacementStrategy.RightTop] = createStrategy(
  axis(AxisType.primary, 'end'),
  axis(AxisType.secondary, 'start'),
);

strategies[PlacementStrategy.RightCenter] = createStrategy(
  axis(AxisType.primary, 'end'),
  axis(AxisType.secondary, 'center'),
);

strategies[PlacementStrategy.Right] = strategies[PlacementStrategy.RightCenter];

strategies[PlacementStrategy.RightBottom] = createStrategy(
  axis(AxisType.primary, 'end'),
  axis(AxisType.secondary, 'end'),
);

interface CalculatedChildPosition {
  /**
   * CSS "top: <value>" in pixels
   */
  top: number;

  /**
   * CSS "left: <value>" in pixels
   */
  left: number;
}

type Rect = {
  top: DOMRect['top'];
  left: DOMRect['left'];
  width: DOMRect['width'];
  height: DOMRect['height'];
}

type ChildRect = {
  width: DOMRect['width'];
  height: DOMRect['height'];
}

/**
 * Redirect type signature
 */
type ViewportRect = ChildRect;

/**
 * Ported to TypeScript from:
 * https://github.com/taskworld/positioning-strategy
 * @license ISC https://taskworld.com/
 */
export function calculateChildPosition(
  strategyName: PlacementStrategy,
  parentRect: Rect,
  childRect: ChildRect,
  viewportRect: ViewportRect,
  { gap = 0 },
): CalculatedChildPosition {
  return strategies[strategyName](parentRect, childRect, viewportRect, { gap });
}

/**
 * Applies the logic to keep an element aligned for one cycle.
 * Does not ensure position context. Does not work with custom Viewports - always window.
 * You likely want `refPositionAbsoluteToViewport` instead.
 * @see calculateChildPosition for the automation strategy
 * @param relativeTo
 * @param applyElement
 * @param gap
 * @param strategy
 */
function keepAlignedTo(
  relativeTo: HTMLElement,
  applyElement: HTMLElement,
  strategy: PlacementStrategy,
  gap = 10,
) {
  const targetRect = relativeTo.getBoundingClientRect();
  const applyRect = applyElement.getBoundingClientRect();

  const styles = calculateChildPosition(strategy, targetRect, applyRect, {
    width: window.outerWidth,
    height: window.outerHeight,
  }, { gap });

  Object.entries(styles).forEach(([key, absolutePosition]) => {
    applyElement.style.setProperty(key, numToRem(absolutePosition));
  });
}

/**
 * Component-Helper function to keep an element - when visible, aligned to the
 * `relativeTarget` element.
 * Forces "position: fixed"!
 * Might force "z-index" ONLY if the computed style equates to "auto"
 * Custom Viewports aren't supported, yet?
 * @see keepAlignedTo
 * @returns function to stop aligning
 */
export function refPositionAbsoluteToViewport(
  element: HTMLElement,
  relativeTarget: HTMLElement,
  strategy: PlacementStrategy,
  gap?: number,
) {
  element.style.setProperty('position', 'fixed');
  const { zIndex } = getComputedStyle(element);

  if (zIndex === 'auto') {
    element.style.setProperty('z-index', '99999');
  }

  let styles;
  let skip;

  keepAlignedTo(relativeTarget, element, strategy, gap);

  return lazifyKeepElementUpdated(
    element,
    () => {
      // the css shouldn't change that often, too drastically.
      // So in order to render 1000+ absolutely position elements
      // and keep a smoothin scrolling experience,
      // we will update the actual css properties every altrenating cycle.
      if (skip) {
        skip = false;
      } else {
        styles = getComputedStyle(element);
        skip = true;
      }

      // if it's somehow renderable (continues with things like visibillity: hidden and oacity: 0)
      if (element.clientWidth && styles.opacity !== '0' && styles.visibility !== 'hidden') {
        keepAlignedTo(relativeTarget, element, strategy, gap);
      }
    }
  );
}
