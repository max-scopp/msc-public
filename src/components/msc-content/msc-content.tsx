import { Component, h, Host, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'msc-content',
  styleUrl: 'msc-content.scss',
  shadow: true,
})
export class MscContent {
  /**
   * Changes the placement direction of this container.
   * See flexbox specs. Applies "weird behaviour" fixes of flexbox.
   */
  @Prop()
  trackX: boolean;

  /**
   * Changes the placement direction of this container.
   * See flexbox specs. Applies "weird behaviour" fixes of flexbox.
   */
  @Prop()
  trackY: boolean;

  /**
   * Overwrites the placement of content (NOT items!) on the horizontal axis
   * See flexbox values
   * May swap with horizontal alignment for correct behaviour
   * @see trackX
   * @see trackY
   */
  @Prop()
  alignX = 'stretch';

  /**
   * Overwrite placement of content (NOT items!) on the vertical axis
   * See flexbox values
   * May swap with horizontal alignment for correct behaviour
   * @see trackX
   * @see trackY
   */
  @Prop()
  alignY = 'flex-start';

  /**
   * Enables purposefully scrolling for the content of this tag.
   */
  @Prop()
  contentScroll: boolean;

  /**
   * Centers the content of this container (NOT items!) on both axis.
   */
  @Prop()
  center: boolean;

  componentWillLoad() {
    if (!this.trackX && !this.trackY) {
      this.trackY = true;
    }
  }

  @Watch('alignX')
  @Watch('alignY')
  validateAlignmentDirection() {
    console.log({ alignX: this.alignX, alignY: this.alignY });
  }

  @Watch('trackX')
  @Watch('trackY')
  validateTrackDirection() {
    if (this.trackX && this.trackY) {
      console.warn(
        'Cannot have content that goes in both dimensions! Use `display: grid` instead.',
      );
    }
  }

  render() {
    // eslint-disable-next-line no-nested-ternary
    const direction = this.trackX ? 'row' : this.trackY ? 'column' : null;
    const yAlignment = this.trackX ? this.alignY : this.alignX;
    const xAlignment = this.trackX ? this.alignX : this.alignY;

    return (
      <Host class={{ scroll: this.contentScroll, center: this.center }}>
        <div
          class="content-span"
          style={{
            '--direction': direction,
            '--align-y': yAlignment,
            '--align-x': xAlignment,
          }}
        >
          <slot />
        </div>
      </Host>
    );
  }
}
