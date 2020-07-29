import { Element, Component, Prop } from '@stencil/core';

/**
 * Utilizes DataProvider Service to define the children asap the component can be initialized.
 */
@Component({
  tag: 'msc-define',
  styleUrl: 'msc-define.scss',
})
export class MscDefine {
  @Prop()
  group: string;

  @Prop()
  name: string;

  @Element()
  host: HTMLMscDefineElement;

  componentWillLoad() {
    const childNodes = this.host.children;
    const toBeDefined = childNodes.length > 1 ? childNodes : childNodes[0];

    if (!this.name) {
      throw new Error(
        'Cannot define element(s) that did not declare a name under which they should be stored!',
      );
    }

    if (this.group) {
      DataProvider.define(this.group, { [this.name]: toBeDefined });
    } else {
      DataProvider.define({ [this.name]: toBeDefined });
    }

    console.info('Defined', {
      DataProvider,
      group: this.group,
      name: this.name,
    });

    Array.from(this.host.children).forEach((child) => {
      this.host.parentNode.insertBefore(child, this.host);
    });

    // document.head.append(this.host);
  }
}
