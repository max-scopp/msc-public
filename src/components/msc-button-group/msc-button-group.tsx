import { Component, Element, h, Host, Prop, State } from '@stencil/core';

import { onResize, randomID } from '../../core/utils';

const safeSpaceForDotoutButton = 75;

/**
 * Collects buttons. Horizontally. Supports `--gap`.
 * If `autohide` is true, any items which to not fit will be
 * rendered as <msc-item /> within an Menu.
 */
@Component({
  tag: 'msc-button-group',
  styleUrl: 'msc-button-group.scss',
  shadow: true,
})
export class MscButtonGroup {
  @Element()
  host: HTMLMscButtonGroupElement;

  /**
   * Hide's the last X items that don't fit to the parent container.
   * items will be re-rendered as <msc-item />
   */
  @Prop({ attribute: 'autohide' })
  autohideItems: boolean;

  /**
   * Ref's to the elements that are being hidden away.
   * Used when activating the related <msc-item />.
   */
  @State()
  private hiddenItems: HTMLUnknownElement[] = [];

  /**
   * Seperate flag when the menu for the hidden elements are visible, or not.
   */
  @State()
  private isMenuVisible = false

  private menuOpenerButton: HTMLMscButtonElement;

  internal = randomID(true);

  componentWillLoad() {
    onResize(this.host, this.updateHiddenItemsIfNeeded.bind(this));
    this.updateHiddenItemsIfNeeded();

  }

  private updateHiddenItemsIfNeeded() {
    if (this.autohideItems) {
      this.validateAndUpdateHiddenItems();
    }
  }

  private get slotItems() {
    const slotElement = this.host.shadowRoot.querySelector('slot');
    return slotElement ? slotElement.assignedElements() : [];
  }

  private validateAndUpdateHiddenItems(rect: ClientRect = this.host.getBoundingClientRect()) {
    const maxSpaceFromParent = rect.width - safeSpaceForDotoutButton;
    const newHiddenItems = [];

    if (maxSpaceFromParent > 0) {
      let collectedWidth = 0;

      Array.from(this.slotItems)
        .forEach((element: HTMLUnknownElement) => {
          const style = getComputedStyle(element);
          const currentSpace = parseFloat(style.marginLeft)
            + element.offsetWidth
            + parseFloat(style.marginRight);

          collectedWidth += currentSpace;

          const elementShouldBeHidden = collectedWidth >= maxSpaceFromParent;
          element.classList.toggle('is-hidden', elementShouldBeHidden);

          if (elementShouldBeHidden) {
            newHiddenItems.push(element);
          }
        });

      if (!newHiddenItems.length) {
        this.isMenuVisible = false;
      }

      this.hiddenItems = newHiddenItems;
    }
  }

  private toggleHiddenItemsMenu = () => {
    this.isMenuVisible = !this.isMenuVisible;
  }

  private HiddenItemsList = () => {
    return this.hiddenItems.map((hiddenElement, hiddenPos) => {
      return (
        <msc-item
          interactive
          key={hiddenPos}
          onActivate={() => { hiddenElement.click(); }}
        >
          {hiddenElement.textContent}
        </msc-item>
      );
    });
  }

  HiddenItemsMenu = () => {
    if (this.autohideItems) {
      const hasHiddenItems = Boolean(this.hiddenItems.length);

      return [
        <msc-button
          hidden={!hasHiddenItems}
          key="hidden-items-dotout"
          onActivate={this.toggleHiddenItemsMenu}
          ref={ref => this.menuOpenerButton = ref}
        >
          <msc-icon name="menu_more" />
        </msc-button>,

        <msc-menu
          key="hidden-items-dropdown"
          positionTo={this.menuOpenerButton}
          open={this.isMenuVisible}
          onClose={this.toggleHiddenItemsMenu}
        >
          <this.HiddenItemsList />
        </msc-menu>,
      ]
    }

    return null;
  }

  render() {
    return (
      <Host class={{ 'auto-hides': this.autohideItems }}>
        <slot />
        <this.HiddenItemsMenu />
      </Host>
    );
  }
}
