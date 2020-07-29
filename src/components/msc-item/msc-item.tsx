import { Component, Element, h, Host, Prop } from '@stencil/core';

import { LinkableComponent } from '../../core/definitions';
import { ensureSpaceBetweenTextFragmentsMatchingQueryFor } from '../../core/utils';
import { match } from 'assert';

@Component({
  tag: 'msc-item',
  styleUrl: 'msc-item.scss',
  shadow: true
})
export class MscItem implements LinkableComponent {
  @Prop({
    attribute: 'to',
  })
  href: string;

  @Prop()
  target: string = '_self';

  @Prop()
  active: boolean;

  @Prop()
  interactive: boolean;

  @Element()
  host: HTMLElement;

  componentWillLoad() {
    this.host.addEventListener('activate', () => {
      if (this.href) {
        open(this.href, this.target);
      }
    });
  }

  render() {
    return (
      <Host
        tabIndex={this.interactive ? '0' : null}
        class={{
          "is-active": Boolean(this.active),
          "is-interactable": Boolean(this.interactive || this.href),
          "is-last": this.host.matches(':last-child')
        }}>
        <span class="before">
          <slot name="before"></slot>
        </span>
        <slot></slot>
        <span class="after">
          <slot name="after"></slot>
        </span>
      </Host >
    );
  }
}
