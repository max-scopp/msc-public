import { ActivateEvent } from './core/utils';

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '@stencil/core/internal/stencil-public-runtime' {

  namespace JSXBase {

    interface DOMAttributes {
      /**
       * This event is also available as vanilla event.
       * This event is a grouped event for 3 different events which all _usually_
       * require a specific way of handling/filtering the wanted variant.
       * Those are:
       * 1) Normal onClick. Nothing special.
       * 2) Keyboard input. Filterered by SPACE or ENTER.
       * 3) Touch Input. Acts as "onClick".
       * 
       * Concurrent events are throttled, therefor only one of those 3 types
       * will be dispatched. Whatever will make it through, it's a CustomEvent
       * that will try to collect the basic information given in each event into
       * the custom event. But you can retrieve the `originatedEvent` which got
       * remapped from the `detail`'s of the CustomEvent.
       */
      onActivate?: (event: ActivateEvent) => void;
    }

  }
}
