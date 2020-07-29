import {
  Component, Element, h, Host, Method, State, Watch, forceUpdate,
} from '@stencil/core';
import { debounce } from 'throttle-debounce';

import { lazifyKeepElementUpdated, lazy } from '../../core/utils';


@Component({
  tag: 'msc-progress-indicator',
  styleUrl: 'msc-progress-indicator.scss',
})
export class MscProgressIndicator {
  /**
   * Flag to signify that the current lifecycle is meant to
   * clean up the UI and the following state will be a reset, clean one again.
   * There are three lifecycles until this component has been reset:
   * - Last render cycle to animate the bar to the end, because this.requests is now empty
   * - closeCycle starts to apply the "close" class to dismiss the finished progress bar.
   * - cleanup the last closeCycle: Put the bar at the start without animating.
   */
  @State()
  closeCycle: boolean;

  @Watch('closeCycle')
  resetCloseCycle(newValue) {
    if (newValue) {
      setTimeout(() => {
        this.closeCycle = false;

        // this assures that the progress bar will be at the begining again
        // without being animated there, because it is depandent to the closeCycle.
        // (in a CSS-className-depndency sense)
        this.totalContinuousRequests = 0;
      }, 500);
    }
  }

  @State()
  requests: Request[] = [];

  @Watch('requests')
  calculatePercentages(newValue) {
    // take your time to update the progress bar.
    // Actual BSL is more important.
    this.applyWork(newValue.length);
  }

  @Element()
  host: HTMLMscProgressIndicatorElement;

  private applyWork = debounce(100, (newCount) => {
    // alright, we've found time to update the progress bar.
    // Let's first figure out if the newCount increased and update
    // "totalContinuousRequests" accordingly
    if (newCount && newCount > this.totalContinuousRequests) {
      this.totalContinuousRequests = newCount;
    } else if (newCount <= 0) {
      // We've processed every request and can now start
      // the closeCycle to hide the progress bar.
      this.closeCycle = true;
    }

    // TODO: Translations/Übersetzung
    const message = `${this.active} of ${this.totalContinuousRequests} Active requests`;

    // whenever the progress changed, update the loading cogs.
    if (this.spinner) {
      this.spinner.message = message;
    } else {
      this.spinner = Controller.Toast.spinner(message);
    }

    if (this.closeCycle && !this.active) {
      // The progress changed and we're in the closing cycle,
      // the time and place to remove the loading cogs.
      this.spinner.dismiss();
      this.spinner = null;
    }
  });

  private spinner: HTMLMscToastElement;

  /**
   * Ongoing requests reported lazily by ApiService
   */
  @Method()
  async ongoing(requests: Request[], aborted?: Error | Response) {
    // Some error was reported. Let's tell the user.
    if (aborted) {
      // OK, so it's a proper error, just show that message then.
      // (Because we have nothing else)
      if (aborted instanceof Error) {
        Controller.Toast.danger(aborted.message);
      } else {
        // This time a response was problematic.
        // Let's clone the response twice so
        // we don't flag the original response as "dirty".
        // After that, we'll:
        // - try(!) to parse the response as json and fail silenty if not parsable.
        // - get the response as pure string
        // timing doesn't really matter,
        // because the problem already occoured in the past and we'll
        // just figure out a way to tell the user in a somewhat timely manner,
        // not an exact moment.
        const [hasJson, hasText] = await Promise.all([
          await aborted.clone().json().catch(() => false),
          await aborted.clone().text(),
        ]);

        // OK, great, now we have everything resolved.
        // Next, let's figure out what's the _meaningful_ message
        // that will be displayed to the user.

        // eslint-disable-next-line no-nested-ternary
        Controller.Toast.danger(hasJson
          ? hasJson.error // If the JSON parsing worked, we'll assume a "error" response has been given
          : hasText.length < 150 // OK so the JSON failed, is the text-response more meaningful?
            ? hasText // HTML Response may be meaningful
            : aborted.statusText, // Response not meaningful, the statusText should at least give some reasoning, e.g. "Internal Server Error"
        );
      }
    }

    this.requests = requests;
  }

  /**
   * Counter that only increases up until every request has been handled.
   * Every request is handled when we receive an empty array from "ongoing".
   * @see ongoing
   * @see calculatePercentages
   */
  @State()
  totalContinuousRequests = 0;

  get active() {
    return this.requests.length;
  }

  componentWillLoad() {
    // Useless feature
    // if (document.readyState !== 'complete') {
    //   this.totalContinuousRequests = 1;
    //   this.host.style.setProperty('--width', '75%');

    //   window.addEventListener('load', () => {
    //     this.host.style.setProperty('--width', '100%');

    //     if (!this.active) {
    //       this.closeCycle = true;
    //     }
    //   });
    // }

    /**
     * "The Magic That Keeps Customers Happy"
     */
    lazifyKeepElementUpdated(this.host, () => {
      if (this.active && this.active < 3) {
        const currentWidth = parseFloat(getComputedStyle(this.host).getPropertyValue('--width'));

        // Random number that's usually(!) quite small but may be once or twice a bit bigger.
        const aBit = (Math.random() * (Math.random() * 25)) / 2;

        this.host.style.setProperty('--width', `${currentWidth + aBit}%`);
      } else if (this.active) {
        console.warn('Cannot make the progress go fancy, too much work to do!');
      }
    }, 600);
  }

  get percent() {
    const progress = ((this.active / this.totalContinuousRequests) * 100);
    return Number.isFinite(progress) ? 100 - progress : 0;
  }

  render() {
    return (
      <Host style={{ '--width': `${this.percent}%` }} class={{ close: this.closeCycle, hidden: !this.totalContinuousRequests }} />
    );
  }
}
