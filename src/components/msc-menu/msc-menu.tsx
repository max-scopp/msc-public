import { Component, h, Prop, Host, Element, Event, Watch, EventEmitter } from '@stencil/core';
import { ensureColorContrastFor, nativeWindowEffectsFor, refPositionAbsoluteToViewport, PlacementStrategy, lazy } from '../../core/utils';


@Component({
  tag: 'msc-menu',
  styleUrl: 'msc-menu.scss',
  shadow: true
})
export class MscMenu {

  @Element()
  host: HTMLElement;

  @Prop()
  open: boolean = true;

  @Prop()
  positionTo: string | HTMLElement;

  @Event()
  close: EventEmitter;
  cancelAbsolutePositioning: () => void;

  @Watch('open')
  handleOpenChange(isOpen: MscMenu['open']) {
    if (isOpen) {
      lazy(() => this.host.focus()); // when it's opening, focus host
    } else {
      this.close.emit(); // otherwise fire the closed event
    }
  }

  positionAbsoluteTo(target: MscMenu['positionTo']) {
    const targetElement = typeof target === 'string'
      ? document.querySelector(target) as HTMLElement
      : target;

    if (targetElement) {
      this.cancelAbsolutePositioning = refPositionAbsoluteToViewport(this.host, targetElement, PlacementStrategy.BottomLeft);
    }
  }

  componentWillUpdate() {
    if (this.positionTo) {
      if (this.cancelAbsolutePositioning) {
        this.cancelAbsolutePositioning();
      }

      this.positionAbsoluteTo(this.positionTo);
    }
  }

  componentWillLoad() {
    ensureColorContrastFor(this.host);

    const close = () => {
      this.open = false;
    }

    nativeWindowEffectsFor(this.host, {
      close: close,
      forceclose: close,
    });

    this.componentWillUpdate();
  }

  render() {
    return (
      <Host hidden={!this.open} role="menu" tabindex={0}>
        <msc-list gap="0">
          <slot />
        </msc-list>
      </Host>
    );
  }
}
