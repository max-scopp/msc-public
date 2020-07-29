import { Component, Element, h, Host, Prop } from '@stencil/core';

import { LinkableComponent } from '../../core/definitions';
import { ensureColorContrastFor, ensureSpaceBetweenTextFragmentsMatchingQueryFor } from '../../core/utils';
import { ButtonState, ButtonTheme } from './types';

@Component({
  tag: 'msc-button',
  styleUrl: 'msc-button.scss',
  scoped: true
})
/**
 * Please rightfully note that you do not really need this component at all times!
 * A simple button or anchor with appriopirate classes can also work wonders.
 *
 * This Component is specifically designed to be a button, as anchor.
 */
export class MscButton implements LinkableComponent {
  /**
   * What kind of button this one is.
   */
  @Prop()
  type: 'submit' | 'reset' | string;

  /**
   * If "to" is provided, should the link have a target be set?
   * @see to
   */
  @Prop()
  target: '_blank' | '_self' | '_parent' | '_top' | string = '_self';

  /**
   * Optional, if provided, the button contains an a11y-anchor inside.
   */
  @Prop({
    attribute: 'to',
    reflect: true,
  })
  href: string;

  /**
   * What state the button has.
   */
  @Prop({
    reflect: true,
  })
  state: ButtonState;

  /**
   * What kind of default-provided theme shall be applied.
   */
  @Prop({
    reflect: true,
  })
  theme: ButtonTheme;

  @Element()
  host: HTMLElement;

  /**
   * Wether or not the component is actually disabled.
   */
  @Prop({
    reflect: true,
  })
  disabled: boolean;

  componentWillLoad() {
    this.host.addEventListener('activate', () => {
      if (this.href) {
        open(this.href, this.target);
      }

      if (!this.type) {
        return;
      }

      const form = this.host.closest('form');

      if (!form) {
        LoggerService.warn(`Provided type=${this.type} but no <form/> has been found!`);
        return;
      }

      switch (this.type) {
        case 'submit':
        case 'reset':
          form[this.type]();
          break;

        default: break;
      }
    });

    this.componentWillUpdate();
  }

  componentWillUpdate() {
    ensureColorContrastFor(this.host);
    ensureSpaceBetweenTextFragmentsMatchingQueryFor(this.host, 'msc-icon');
  }

  render() {
    return (
      <Host tabIndex={0} role="button">
        <slot />
      </Host>
    );
  }
}
