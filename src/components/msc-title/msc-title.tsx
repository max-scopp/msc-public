import { Component, Element, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'msc-title',
  styleUrl: 'msc-title.scss',
  scoped: true,
})
export class MscTitle {
  @Prop()
  subline: boolean;

  @Element()
  host: HTMLElement;

  render() {
    return <Host role="heading">
      <span class={{
        "sub-line": this.subline
      }}
      ><slot /></span>
    </Host>
  }
}
