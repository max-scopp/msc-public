import {
  Component,
  Element,
  h,
  Host,
  Listen,
  Method,
  Prop,
  State,
} from '@stencil/core';

import { ensureColorContrastFor, nativeWindowEffectsFor } from '../../core/utils';
import { SidebarPosition, SidebarPositions } from './types';

@Component({
  tag: 'msc-sidebar',
  styleUrl: 'msc-sidebar.scss',
  shadow: true,
})
export class MscSidebar {
  @Element()
  host: HTMLMscSidebarElement;


  /**
   * Controls wether or not only one item can be expanded.
   */
  @Prop({
    reflect: true,
  })
  single = true;


  /**
   * Wether or not the sidebar should take up space in the document.
   * If true, full content is exposed on hovering/tap.
   */
  @Prop({
    reflect: true,
  })
  overlay = true;


  /**
   * If true, styling applies position: fixed instead of position: absolute
   */
  @Prop({
    reflect: true,
  })
  fixed: boolean;


  /**
   * If true, styling applies position: fixed instead of position: absolute
   */
  @Prop({
    reflect: true,
  })
  side: SidebarPosition = SidebarPositions.Default;

  /**
   * If `overlay` true, this is used to indicate if visible, regardless of cursor position.
   */
  @State()
  isVisible = false;

  /**
   * Should the Sidebar expand when you're near it?
   */
  @Prop({
    attribute: 'auto-show',
  })
  autoShow = false;

  /**
   * Should the Sidebar always be open?
   */
  @Prop({
    attribute: 'open',
  })
  keepOpen = false;


  /**
   * Shows the Sidebar.
   */
  @Method()
  async show() {
    this.toggle(true);
  }

  /**
   * Hides the Sidebar.
   */
  @Method()
  async hide() {
    this.toggle(false);
  }

  private get canBeToggled() {
    return this.keepOpen ? false : this.overlay || this.fixed;
  }

  /**
   * Inverts current state or forces a specific state
   * @param newState
   */
  @Method()
  async toggle(newState = !this.isVisible) {
    if (this.canBeToggled) {
      if (newState !== this.isVisible) {
        this.isVisible = newState;

        if (newState) {
          this.host.focus();
        } else {
          console.log('sidebar:blur');
          Accessibility.blurElementWithinTarget(this.host);
        }
      }
    }
  }

  @Listen('focus', { capture: true })
  validateFocus() {
    const focusWithin = this.host.matches(':focus-within');

    if (!this.isVisible && focusWithin) {
      this.isVisible = true;
    }
  }

  componentWillLoad() {
    ensureColorContrastFor(this.host, true);
    if (!this.canBeToggled) {
      this.isVisible = true;
    }

    if (this.keepOpen) {
      this.isVisible = true;
    }
  }

  componentDidLoad() {
    nativeWindowEffectsFor(this.host, {
      forceclose: () => {
        this.hide();
      },
      close: () => {
        this.hide();
      },
      focusout: () => this.hide(),
      open: () => this.show(),
    });

    // catch only relevant clicks for component
    this.host.shadowRoot.addEventListener('click', (ev) => {
      if (this.single) {
        // get all open childs
        this.host.querySelectorAll(':scope > [open]').forEach((openItem) => {
          // is current open item the same as the clicked on item?
          if (openItem !== ev.target) {
            // no? Let's close it.
            openItem.attributes.removeNamedItem('open');
          }
        });
      }
    });
  }

  render() {
    return (
      <Host
        tabIndex={this.overlay ? -1 : 0}
        role={this.fixed ? 'group' : 'menu'}
        aria-expanded={String(this.isVisible)}
        aria-hidden={this.canBeToggled ? String(!this.isVisible) : null}
        class={{
          'is-fixed': this.fixed,
          'is-active': this.isVisible && (this.overlay || this.fixed),
          'is-visible': this.isVisible,
          'has-autoshow': this.autoShow,
        }}
      >
        <div class="sidebar__lead" role="presentation">
          <slot name="lead" />
        </div>

        <div class="sidebar__list" role="presentation">
          <slot />
        </div>

        <div class="sidebar__trailer" role="presentation">
          <slot name="trailer" />
        </div>

        <div class="activator-space" />
      </Host>
    );
  }
}
