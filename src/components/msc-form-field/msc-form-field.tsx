import {
  Component, h, Prop, Host,
} from '@stencil/core';


/**
 * TODO: Implement
 */
@Component({
  tag: 'msc-form-field',
  styleUrl: 'msc-form-field.scss',
  shadow: true
})
export class MscFormField {
  @Prop()
  label: string;

  render() {
    return (
      <Host>
        <span class="label">{this.label}</span>
        <div class="slot"><slot /></div>
        <span class="state">
          <slot name="state" />
        </span>
      </Host>
    );
  }
}
