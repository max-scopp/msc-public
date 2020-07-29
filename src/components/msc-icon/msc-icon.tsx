import {
  Component, Element, Prop, Host, h,
} from '@stencil/core';

/**
 * TODO: This class is still buggy for subsequent updates.
 */
@Component({
  tag: 'msc-icon',
  styleUrl: 'msc-icon.scss',
})
export class MscIcon {
  @Element()
  private host: HTMLMscIconElement;

  /**
   * The IconSet to pick the icon-name from.
   * If not provied, the `defaultIconSet` is used from ApplicationService.
   */
  @Prop()
  public set: string;

  /**
   * The iconName to resolve. This is dependant on how you declared your own
   * IconSet.
   */
  @Prop()
  public name: string;

  componentWillUpdate() {
    this.host.innerHTML = '';
    this.replaceWithNewIcon();
  }

  componentWillLoad() {
    this.host.innerHTML = '';
    this.replaceWithNewIcon();
  }

  private replaceWithNewIcon() {
    // eslint-disable-next-line no-underscore-dangle
    let _className = 'msc-icon-placeholder';

    // eslint-disable-next-line no-underscore-dangle
    let _tag = 'span';
    let _node: SVGElement = null;

    try {
      const iconDef = IconService.resolve(this.set, this.name);
      // eslint-disable-next-line @stencil/strict-boolean-conditions
      if (iconDef) {
        _className = iconDef.class;
        _tag = iconDef.tag;
        _node = iconDef.node;
      }
    } catch (e) {
      console.warn(e);
    } finally {
      if (_node) {
        // clone's the "svg" type SVGElement
        const cloned = _node.cloneNode(true);
        this.host.prepend(cloned);
      } else {
        // render font icons like fontawesome
        const tagElement = document.createElement(_tag);
        tagElement.className = _className;

        this.host.prepend(tagElement);
      }
    }
  }

  render() {
    return <Host role="presentation" />;
  }
}
