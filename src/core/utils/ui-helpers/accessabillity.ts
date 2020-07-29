/**
 * Details from the originated event that will be merged into
 * a singular custom event.
 */
export interface ActivationDetails {
  /**
   * The type of the originated event.
   * E.g.:
   * "click"
   * "touch"
   * "keypress"
   */
  type: string;

  /**
   * The element that dispatched the original event.
   */
  target: EventTarget;

  /**
   * The original event from which the details will be extracted.
   */
  originalEvent: ActivatedEvent;
}

/**
 * @internal
 */
type ActivateCallback = (ev: ActivatedEvent) => any;

/**
 * @internal
 */
export type ActivatedEvent = MouseEvent | KeyboardEvent | TouchEvent;

/**
 * A custom event that merges all 3 common events:
 * - Mouse input
 * - Accessible Keyboard input
 * - Touch input
 */
export interface ActivateEvent extends CustomEvent {
  detail: ActivationDetails;
}

type ActivatedElement = Element & {
  __activateHandlers: ActivateCallback[];
};

/**
 * "Activate" is a custom event that is caught by both
 * mouseclick aswell as keydown, where if it's an keydown event, it's only
 * dispatched when that key was SPACE or ENTER on an focused element.
 * Additionally, any touch events are being handled just like a **normal** mouseclick.
 * 
 * "Activate" is being re-dispatched with the originated event inside, at the same target.
 * It will bubble and so far, I don't see a purpose to cancel it.
 *
 * This function will handle the original events and additionally unpacks the inner event which
 * will be provided to `callback`.
 * Therefor, we use activate to merge the types in order to handle three specific types in one.
 *
 * @param element
 * @param callback
 */
export function applyActivateAndUnpackForCallback(element: Element, callback: ActivateCallback) {
  let skip = false;

  const target = element as ActivatedElement;

  // eslint-disable-next-line no-underscore-dangle
  target.__activateHandlers = target.__activateHandlers || [];

  // eslint-disable-next-line no-underscore-dangle
  target.__activateHandlers.forEach((knownCb) => {
    if (callback === knownCb) {
      skip = true;
      LoggerService.warn('Cannot register "activate" listener on element, callback already added! This can be ignored when HMR applied updates in DevMode.');
    }
  });

  if (skip) {
    return;
  }

  // eslint-disable-next-line no-underscore-dangle
  target.addEventListener('activate', (custom: CustomEvent) => callback(custom.detail.originalEvent));

  // eslint-disable-next-line no-underscore-dangle
  target.__activateHandlers.push(callback);
}
