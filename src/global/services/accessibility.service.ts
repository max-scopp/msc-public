import { Build } from '@stencil/core';

import { last } from '../../core/utils/general';
import { Singleton } from '../../singleton';

interface UIEventHistoryEntry {
  target: HTMLElement | Window;
  didRelateTo: HTMLElement;
}

interface TracerDefinition {
  criteria: Function;
  depth: number;
  stack: UIEventHistoryEntry[];
  generator: Generator<UIEventHistoryEntry>;
}

/**
 * Configures when to forcefully close a
 * registered, traceable generator instance.
 */
const CRITICAL_LIMIT = 1000;

interface Listener {
  target: HTMLElement;
  callback: Function;
  bucket: UIEventHistoryEntry[] | UIEventHistoryEntry[];
}

let AccessLogger;

export default class AccessibilityService extends Singleton {

  static getInstance() {
    if (!super.instance) {
      AccessLogger = LoggerService.extendNS('accessibility');
    }

    return super.getInstance();
  }

  // eslint-disable-next-line class-methods-use-this
  focusWithin(target: HTMLElement) {
    return target.matches(':focus-within');
  }

  // eslint-disable-next-line class-methods-use-this
  get activeElement() {
    return document.activeElement as HTMLElement;
  }

  blurElementWithinTarget(target: HTMLMscSidebarElement) {
    if (this.focusWithin(target)) {
      this.activeElement.blur();
    }
  }

  readonly _historyLimit = 5;

  _focusHistory: UIEventHistoryEntry[] = [];

  _blurHistory: UIEventHistoryEntry[] = [];

  registeredTracers: TracerDefinition[] = [];

  listeners: Listener[] = [];

  constructor() {
    super();
    // debug for accessability
    window.addEventListener('visibilitychange', this.handle, true);
    window.addEventListener('focus', this.handle, true);
    window.addEventListener('blur', this.handle, true);
  }

  // eslint-disable-next-line
  logIt({
    view, type, target, relatedTarget,
    defaultPrevented,
    bubbles,
  }: FocusEvent) {
    // eslint-ignore-next-line
    LoggerService.log(`ui:${type} (prevented? ${defaultPrevented}) (bubbles? ${bubbles})`, target);
  }

  push<T extends UIEventHistoryEntry>(to: T[], entry: T) {
    to.push(entry);

    this.listeners
      .forEach((listenerEntry) => {
        if (listenerEntry.bucket === to) {
          if (listenerEntry.target === entry.target) {
            listenerEntry.callback();
          } else if (listenerEntry.bucket === this._blurHistory) {
            // if we're on a blur-cycle and the case above didn't match,
            // maybe an element _within_ listenerEntry did blur?
            if (entry.target !== window) {
              if (listenerEntry.target.contains(entry.target as HTMLElement)) {
                listenerEntry.callback();
              }
            }
          }
        }
      });

    if (to.length > this._historyLimit) {
      to.shift();
    }
  }


  /**
   * @see `trace`
   * @deprecated
   * @param instance
   */
  removeTracer(instance) {
    const index = this.registeredTracers.findIndex((traceEntry) => traceEntry.generator === instance);
    delete this.registeredTracers[index];
  }

  /**
   * This super cool function has been deprecated because I was overthinking.
   * @deprecated
   */
  trace<T extends UIEvent>(traceCriteria: (ev: T) => boolean, preloadStack = []) {
    const entry = {
      criteria: traceCriteria,
      depth: 0,
      stack: preloadStack,
      generator: (function* backwardsTracableGenerator() {
        let hasDepthLeft;

        do {
          hasDepthLeft = entry.stack.length > 0;
          // eslint-disable-next-line no-plusplus
          entry.depth++;
          yield (entry.stack.pop()) as T;
        } while (entry.depth < CRITICAL_LIMIT && hasDepthLeft);
      }(/* make generator */)),
    };

    this.registeredTracers.push(entry);
    return entry.generator;
  }

  /**
   * @see `trace`
   * @deprecated
   * @param ev
   */
  lazilyRunTracers(ev: any) {
    this.registeredTracers.forEach((tracerEntry) => setTimeout(() => {
      const shouldInclude = tracerEntry.criteria(ev);
      if (shouldInclude) {
        tracerEntry.stack.push(ev);
      }
    }));
  }

  handle = (ev) => {
    const { type, target, relatedTarget } = ev;

    if (Build.isDev) {
      this.logIt(ev);
    }

    switch (type) {
      case 'blur':
        this.push(this._blurHistory, {
          target,
          didRelateTo: relatedTarget,
        });
        break;
      case 'focus':
        this.push(this._focusHistory, {
          target,
          didRelateTo: relatedTarget,
        });
        break;
      default: break;
    }
  }

  preserveBlurredElementBeforeFocusAndFocusOnTargetBlur(_target: HTMLElement) {
    const target = _target;
    // eslint-disable-next-line no-multi-assign
    const a11yDef = (target['msc-a11y'] = target['msc-a11y'] || {});
    let activatedEl;

    window.addEventListener('activate', (ev) => {
      activatedEl = ev.target;
    });

    window.addEventListener('focus', (ev) => {
      activatedEl = null;
    }, true);

    this.onFocusOn(target, () => {
      a11yDef.lastFocus = this.lastElementDidBlur;
      AccessLogger.info('a11yDef.lastFocus', a11yDef.lastFocus);
    });

    this.onBlurOf(target, () => {
      const focusWithin = target.matches(':focus-within');

      if (!focusWithin) {
        if (!a11yDef.lastFocus) {
          LoggerService.warn('Unable to revert focus to related element whose target received focus.');
        } else if (!document.contains(a11yDef.lastFocus.target)) {
          LoggerService.warn('Unable to revert focus to related element which does no longer exist in the document.');
        } else if (!activatedEl) {
          a11yDef.lastFocus.target.focus();
          AccessLogger.info('Revert focus as outlined by the guidelines.', a11yDef.lastFocus);
        } else {
          AccessLogger.warn('STOP! User tried to focus a specific element. No fallback to last.');
        }
      }
    });
  }

  addPushListener(element: HTMLElement, callback, bucket) {
    this.listeners.push({
      target: element,
      callback,
      bucket,
    });
  }

  onFocusOn(element, callback) {
    this.addPushListener(element, callback, this._focusHistory);
  }

  onBlurOf(element, callback) {
    this.addPushListener(element, callback, this._blurHistory);
  }

  focusLastElement() {
    const lastFocus = this.lastElementDidBlur;
    if (lastFocus) {
      lastFocus.target.focus();
    } else {
      LoggerService.warn('Unable to revert focus: Last blurred element does NOT exist!');
    }
  }

  blurLastElement() {
    const lastBlur = this.lastElementHadFocus;
    if (lastBlur) {
      lastBlur.target.blur();
    } else {
      LoggerService.warn('Unable to blur: Last focused element does NOT exist!');
    }
  }

  get lastElementHadFocus() {
    return last(this._focusHistory);
  }

  get lastElementDidBlur() {
    return last(this._blurHistory);
  }
}
