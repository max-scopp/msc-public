import { ActivatedEvent } from '../../core/utils';
import { throttle } from 'throttle-debounce';

/**
 * Generalizes the following events into one standardized event to minimize
 * thge usual overhead to support each case.
 * - Redirect left mouse click
 * - Dispatch if keyup was the "Enter" or "Space" key
 * - Dispatch if "touch"
 * @param viewport 
 */
export function redirectInteractionToUniversialEvent(viewport: Window | ShadowRoot = window) {
  const dispatchDidActivate = throttle(10, (type, originalEvent: ActivatedEvent) => {
    const event = new CustomEvent('activate');

    event.initCustomEvent('activate', true, true, {
      type,
      target: originalEvent.target,
      originalEvent,
    });

    Object.assign(event, {
      altKey: originalEvent.altKey,
      ctrlKey: originalEvent.ctrlKey,
      metaKey: originalEvent.metaKey,
      relatedTarget: (originalEvent as any).relatedTarget || originalEvent.currentTarget,
      shiftKey: originalEvent.shiftKey,
      returnValue: originalEvent.returnValue
    });

    originalEvent.target.dispatchEvent(event);
    return event;
  });

  viewport.addEventListener('click', (ev: MouseEvent) => {
    dispatchDidActivate(ev.type, ev);
  });

  viewport.addEventListener('touch', (ev: TouchEvent) => {
    dispatchDidActivate(ev.type, ev);
  });

  viewport.addEventListener('keyup', (ev: KeyboardEvent) => {
    switch (ev.key) {
      case 'Enter':
      case 'Space':
        dispatchDidActivate(ev.type, ev);
        break;
      default: break;
    }
  });
}
