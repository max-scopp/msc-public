import {
  Component, h, Host, Prop, Watch,
} from '@stencil/core';

import { numberLikeCSSValue, numToRem, unitlessNumericString } from '../../core/utils';


@Component({
  tag: 'msc-grid',
  styleUrl: 'msc-grid.scss',
  shadow: true,
})
export class MscGrid {
  /**
   * The minimum width of an item of the grid
   */
  @Prop()
  gap: string | number;

  /**
   * Define's the grid-template
   */
  @Prop()
  template: string;

  @Watch('gap')
  validateGap(newValue: string | number) {
    const newGap = unitlessNumericString(newValue)
      ? numToRem(parseInt(newValue as string, 10))
      : newValue;

    this.gap = newGap;
  }

  /**
   * The minimum width of an item of the grid
   */
  @Prop()
  base: string | number;

  /**
   * Center grid items in their item-container?
   */
  @Prop({ attribute: 'center-items' })
  centerItems: boolean;

  /**
   * Should every cell's height equal to it's --base width?
   */
  @Prop({ attribute: 'center-items' })
  squared: boolean;

  /**
   * Center container of all item-containers?
   */
  @Prop({ attribute: 'center-content' })
  centerContent: boolean;

  @Watch('base')
  validateBase(newValue, oldValue?) {
    if (newValue !== oldValue) {
      if (typeof newValue === 'number') {
        this.base = numberLikeCSSValue(newValue);
      } else if (unitlessNumericString(newValue)) {
        this.base = numberLikeCSSValue(newValue);
      }
    }
  }

  componentWillLoad() {
    this.validateBase(this.base);
    this.validateGap(this.gap as string);
  }

  render() {
    return (
      <Host style={{
        '--template': this.template ? String(this.template) : '',
        '--base': this.base ? String(this.base) : '',
        '--gap': this.gap ? String(this.gap) : '',
      }}
      >
        <slot />
      </Host>
    );
  }
}
