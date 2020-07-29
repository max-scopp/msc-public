import { throttle } from "throttle-debounce";

/**
 * Assign's multiple eventTypes onto a single element.
 * Useful for Accessabillity, where you need to reflect different input behaviours.
 * @param target the HTMLElement that shall assign the events to
 * @param events the various event-types you'd like to assign, MUST BE UNIQUE
 * @param callback Callee when event criteria applies
 */
export function addUnionEventListener(
  target: HTMLElement,
  events: string[],
  callback: (event: Event) => void,
  options?: AddEventListenerOptions,
) {
  const listeners = new Map();
  const throttleInstantFollowingEventsCallback = throttle(10, callback);

  events.forEach((eventType) => {
    target.addEventListener(eventType, throttleInstantFollowingEventsCallback, options);

    if (listeners.has(eventType)) {
      throw new Error(`addUnionEventListener: The provided event-types must be unique per unionListener, duplicate: "${eventType}", saw: "${events}"`);
    }

    listeners.set(eventType, throttleInstantFollowingEventsCallback);
  });

  return function cancelSubscription() {
    listeners.forEach((assignedListener, type) => {
      target.removeEventListener(type, assignedListener);
    });
  };
}
