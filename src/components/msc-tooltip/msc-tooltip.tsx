import {
  Component, Element, h, Host, Prop, State, Watch,
} from '@stencil/core';

import {
  addUnionEventListener,
  PlacementStrategy,
  randomID,
  refPositionAbsoluteToViewport,
} from '../../core/utils';
import { TooltipPosition, TooltipPositions } from './types';

@Component({
  tag: 'msc-tooltip',
  styleUrl: 'msc-tooltip.scss',
})
export class MscTooltip {
  private static tooltipPositionMapping = {
    [TooltipPositions.Top]: PlacementStrategy.Top,
    [TooltipPositions.Bottom]: PlacementStrategy.Bottom,
    [TooltipPositions.Left]: PlacementStrategy.Left,
    [TooltipPositions.Right]: PlacementStrategy.Right,
  };

  /**
   * Where the actual tooltip needs to be positioned.
   * Ignored when there is no space.
   */
  @Prop()
  position: TooltipPosition = TooltipPositions.Top;

  /**
   * Idenficator (id) for targeted element. Fallback to <slot/> if not provided.
   * Tooltip will be placed relative to the found element.
   * If the element is not found, the component will break (but a developer notice will be logged).
   */
  @Prop()
  for: string = null;

  /**
   * All tooltips are now globally positioned by default.
   * It's just better.
   * @deprecated
   */
  @Prop()
  global: boolean;

  @State()
  hover: boolean;

  private forElement: HTMLElement;

  private cancelLeaveListener;

  private cancelEnterListener;

  @Element()
  host: HTMLMscTooltipElement;

  saveTooltipRef = (ref) => { this.tooltipElement = ref; };

  private tooltipElement: HTMLElement;

  private tooltipID = randomID();

  componentDidLoad() {
    refPositionAbsoluteToViewport(
      this.tooltipElement,
      this.forElement || this.host,
      MscTooltip.tooltipPositionMapping[this.position],
    );
  }

  componentWillLoad() {
    if (this.global) {
      LoggerService.deprecate('msc-tooltip: "global" is no longer needed, remove usage', this.host);
    }

    if (this.for !== null) {
      this.selectAndPrepForElement(this.for);
    } else {
      // we don't reference a specific element, so we'll use the child node
      const childSlotNodes = Array.from(this.host.children);
      if (childSlotNodes.length === 1) {
        const [child] = childSlotNodes;
        this.forElement = child as HTMLElement;
      } else {
        LoggerService.warn('msc-tooltip: Cannot assign ARIA-labelledby, no more than one slot node allowed!');
      }

      this.setupForElement();
      this.flattenSelfAndSlotToParent();
      this.appendSelfToDocumentEnd();
    }
  }

  private setupForElement() {
    // now, we have "forElement", which is preffered by "assignListeners"
    this.assignListeners();

    // also make sure the refrenced element has the right aria rules
    this.assignAriaForElement();
  }

  @Watch('for')
  selectAndPrepForElement(id, oldId?) {
    // do we reference an element and is that different from the previous one?
    if (id && id !== oldId) {
      // if so, make sure the previous listeners get cancelled.
      if (this.cancelEnterListener) {
        this.cancelEnterListener();
      }

      if (this.cancelLeaveListener) {
        this.cancelLeaveListener();
      }

      // next, let's get the related element
      this.forElement = document.getElementById(id);

      if (!this.forElement) {
        LoggerService.warn('msc-tooltip: Cannot find related element to reference tooltip "for" (see prop/attribute)');
        return;
      }

      this.setupForElement();
    }
  }

  /**
   * EventListeners
   */
  private assignListeners() {
    this.cancelEnterListener = addUnionEventListener(this.forElement, ['mouseover', 'focus'], () => {
      this.hover = true;
    }, { capture: true });

    this.cancelLeaveListener = addUnionEventListener(this.forElement, ['mouseleave', 'blur'], () => {
      this.hover = false;
    }, { capture: true });
  }

  /**
   * a11y
   */
  private assignAriaForElement() {
    if (!this.forElement.hasAttribute('aria-labelledby')) {
      this.forElement.setAttribute('aria-labelledby', this.tooltipID);
    } else {
      LoggerService.info('msc-tooltip: Reference element already has ARIA-labelledby, skipping.');
    }
  }

  /**
   * Put ourself at the end of the document
   */
  // eslint-disable-next-line class-methods-use-this
  private appendSelfToDocumentEnd() {
    // document.body.append(this.host);
  }

  /**
   * From: <msc-tooltip><other-stuff/></msc-tooltip>
   * To: <msc-tooltip /><other-stuff />
   */
  private flattenSelfAndSlotToParent() {
    Array.from(this.host.children).forEach((child) => {
      this.host.insertAdjacentElement('afterend', child);
    });
  }

  /**
   * What should the displayed within the tooltip?
   */
  @Prop()
  label: string;

  render() {
    return (
      <Host>
        <div
          ref={this.saveTooltipRef}
          id={this.tooltipID}
          role="tooltip"
          aria-hidden="true"
          class={{
            hover: this.hover,
            tooltip: true,
            [`tooltip--${this.position}`]: Boolean(this.position),
          }}
        >
          {this.label}
          <slot />
        </div>
      </Host>
    );
  }
}
