import {
  Component, Element, h, Host, Prop, Watch,
} from '@stencil/core';

import { numToRem, unitlessNumericString } from '../../core/utils';
import { Direction, Directions } from './types';

@Component({
  tag: 'msc-list',
  styleUrl: 'msc-list.scss',
})
export class MscList {
  @Prop()
  direction: Direction;

  @Prop({ reflect: true })
  gap: number | string = 3;

  @Prop()
  reverse: boolean;

  @Element()
  host: HTMLMscListElement;

  async componentWillLoad() {
    this.validateGap(this.gap as string);
  }

  @Watch('gap')
  async validateGap(newValue: string | number) {
    const newGap = unitlessNumericString(newValue)
      ? numToRem(parseInt(newValue as string, 10))
      : newValue;
    this.gap = newGap;
  }

  render() {
    const { direction: dir, gap } = this;

    return (
      <Host
        style={{
          '--gap': String(gap),
          '--direction':
            // eslint-disable-next-line no-nested-ternary
            dir === Directions.Horizontal
              ? this.reverse
                ? 'column-reverse'
                : 'column'
              : this.reverse
                ? 'row-reverse'
                : 'row',
        }}
      >
        <slot />
      </Host>
    );
  }
}
