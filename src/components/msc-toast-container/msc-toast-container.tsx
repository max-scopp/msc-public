import {
  Component,
  Element,
  Method,
  State,
} from '@stencil/core';


@Component({
  tag: 'msc-toast-container',
  styleUrl: 'msc-toast-container.scss',
})
export class MscToastContainer {
  @State()
  toasts: HTMLMscToastElement[] = [];

  @Element()
  host: HTMLMscToastContainerElement;

  /**
   * Adds an existing toast node
   */
  @Method()
  async addToast(toast: HTMLMscToastElement) {
    if (toast.indicator) {
      this.toasts = [toast, ...this.toasts];
    } else {
      this.toasts = [...this.toasts, toast];
    }
  }

  /**
   * Removes an existing toast node.
   */
  @Method()
  async removeToast(toast: HTMLMscToastElement) {
    this.toasts = this.toasts.filter((existingToast) => existingToast !== toast);
  }

  componentWillLoad() {
    this.componentWillUpdate();
  }

  componentWillUpdate() {
    this.toasts.forEach((toast, index) => {
      const atPosition = this.host.childNodes.item(index);
      if (atPosition !== toast) {
        this.host.appendChild(toast);
      }
    });
  }
}
