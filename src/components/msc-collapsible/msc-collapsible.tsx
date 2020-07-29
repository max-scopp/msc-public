import { Component, h, Host, Method, Prop } from '@stencil/core';

/**
 * TODO: Allow Animations; set duration via css-var
 */
@Component({
  tag: 'msc-collapsible',
})
export class MscCollapsible {
  @Prop({ attribute: 'open' })
  isVisible = true;

  @Method()
  async show() {
    this.toggle(false);
  }

  @Method()
  async hide() {
    this.toggle(true);
  }

  @Method()
  async toggle(newState = !this.isVisible) {
    if (newState !== this.isVisible) {
      this.isVisible = newState;
    }
  }

  render() {
    return (
      <Host style={{ display: this.isVisible ? '' : 'none' }}>
        <slot />
      </Host>
    );
  }
}
