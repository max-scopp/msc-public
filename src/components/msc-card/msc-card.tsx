import { Component, Element, h, Host, Prop } from '@stencil/core';

import { LinkableComponent } from '../../core/definitions';
import { ensureColorContrastFor } from '../../core/utils';

@Component({
  tag: 'msc-card',
  styleUrl: 'msc-card.scss',
  scoped: true,
})
export class MscCard implements LinkableComponent {
  @Prop()
  target: string = '_self';

  @Element()
  host: HTMLMscCardElement;

  /**
   * Link where to go to when click
   */
  @Prop({
    attribute: 'to',
    reflect: true,
  })
  href: string;

  componentWillLoad() {
    ensureColorContrastFor(this.host);

    this.host.addEventListener('activate', () => {
      if (this.href) {
        open(this.href, this.target);
      }
    })
  }

  render() {
    return (
      <Host>
        <div class="lead">
          <slot name="lead" />
        </div>
        <slot />
        <div class="trailer">
          <slot name="trailer" />
        </div>
      </Host>
    );
  }
}
