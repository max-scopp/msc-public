import {
  Component, h, Prop, Element,
} from '@stencil/core';
import { ensureColorContrastFor } from '../../core/utils';

@Component({
  tag: 'msc-badge',
  styleUrl: 'msc-badge.scss',
  shadow: true,
})
export class MscBadge {
  @Prop()
  color: string;

  @Prop({
    reflectToAttr: true,
  })

  /**
   * Controlled via CSS
   */
  block: any;

  @Element()

  host: HTMLMscBadgeElement;

  componentDidLoad() {
    this.componentDidUpdate();
    ensureColorContrastFor(this.host);
  }

  componentDidUpdate() {
    if (this.color) {
      this.host.style.setProperty('--background', this.color);
    }
  }

  render() {
    return <slot />;
  }
}
