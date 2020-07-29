import { throttle } from 'throttle-debounce';

export function onResize(element: HTMLElement, call: any) {
  // const callLazy = throttle(300, call);

  const draw = (oldRect) => {
    const {
      width: oldWidth, height: oldHeight, x: oldX, y: oldY,
    } = oldRect;

    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();

      const {
        width, height, x, y,
      } = rect;

      if (
        oldWidth !== width
        || oldHeight !== height
        || oldX !== x
        || oldY !== y
      ) {
        call(rect);
      } else {
        /* viewport resize without effect on target */
      }
      draw(rect);
    });
  };

  // TODO: (Perf) Add/Remove request-loop whenever it's "resizing"
  draw(element.getBoundingClientRect());
}

export function whileScrollingOn(element: HTMLElement, call: any) {
  const throttled = throttle(75, () => call());
  element.addEventListener('scroll', throttled);
}

const defaultOptions = {
  classNameRight: 'fix-text-right',
  classNameLeft: 'fix-text-left',
};

export function ensureSpaceBetweenTextFragmentsMatchingQueryFor(
  target: Element,
  querySelector: string,
  opts?,
) {
  const options: typeof defaultOptions = {
    ...defaultOptions,
    ...opts,
  };

  const matchingRequireFix = target.querySelectorAll(querySelector);

  const isTextNode = (node) => node && node.nodeType === Node.TEXT_NODE;
  const hasText = (node) => node && node.textContent.match(/[^\s]/);

  matchingRequireFix.forEach((toFixElement) => {
    const nextNode = toFixElement.nextSibling;
    const prevNode = toFixElement.previousSibling;

    if (isTextNode(nextNode) && hasText(nextNode)) {
      toFixElement.classList.add(options.classNameRight);
    }

    if (isTextNode(prevNode) && hasText(prevNode)) {
      toFixElement.classList.add(options.classNameLeft);
    }
  });
}
