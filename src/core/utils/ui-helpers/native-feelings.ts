import { addUnionEventListener } from "./add-events";

export interface EffectsRequirements {
  [key: string]: any;

  focusout?: Function;

  /**
   * A normal opener. Might be called whenever the element in question
   * received focus, or focus-within.
   */
  open?: Function;

  /**
   * A normal closer. Might be called when the element in question looses focus.
   */
  close?: Function;

  /**
   * The user requested to forcefully close the element in question.
   * E.g. When he pressed ESC.
   */
  forceclose: Function;
}

export function applyExitListeners(element: HTMLElement, run): void {
  const focusWithin = () => element.matches(':focus-within');

  addUnionEventListener(element, ['focusout', 'blur'], () => {
    setTimeout(() => {
      if (!focusWithin()) {
        run('focusout');
        run('close');
      }
    }, 200);
  });

  window.addEventListener('keyup', (keyEv) => {
    if (keyEv.key === 'Escape') {
      if (focusWithin()) {
        run('forceclose');
      }
    }
  });
}

export function applyEnterListeners(element, run) {
  element.addEventListener('focusin', () => run('open'));
}

export function nativeWindowEffectsFor(
  element: HTMLElement,
  effectImplementationObject: EffectsRequirements,
) {
  const run = (type) => {
    if (effectImplementationObject[type]) {
      effectImplementationObject[type]();
    } else {
      // Method not implemented
    }
  };

  if (typeof element.tabIndex === 'number') {
    LoggerService.info('nativeWindowEffectsFor: targeted element already has an tabIndex, skipping.');
  } else {
    // eslint-disable-next-line no-param-reassign
    element.tabIndex = 0;
  }


  if (element instanceof ShadowRoot) {
    console.error(
      'Cannot apply nativity on the shadowRoot, nor any items inside.',
    );
  }

  applyExitListeners(element, run);
  applyEnterListeners(element, run);
  Accessibility.preserveBlurredElementBeforeFocusAndFocusOnTargetBlur(element);
}
