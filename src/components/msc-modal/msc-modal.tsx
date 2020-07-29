import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Method,
  Prop,
  Watch,
} from '@stencil/core';

import { nativeWindowEffectsFor, noop, randomID, ensureColorContrastFor } from '../../core/utils';
import { ModalController } from '../../global/controllers';

/**
 * If you provide custom actions and those need to onAffirm or onReject, don't
 * forget to add data-positive or data-negative!
 */
@Component({
  tag: 'msc-modal',
  styleUrl: 'msc-modal.scss',
})
export class MscModal {
  @Element()
  host: HTMLMscModalElement;

  /**
   * Don't position using "absolute".
   * Ignore parent, use position "fixed" when true.
   */
  @Prop()
  global: boolean;

  /**
   * Defines the Modal-Role. Is it a dismissable alert or dialog?
   */
  @Prop({ reflect: true })
  role: 'dialog' | 'alert' | 'alertdialog' = 'dialog';

  /**
   * The title to display at the top. Supply a falsy value to disclose.
   */
  @Prop({ attribute: 'title' })
  displayTitle: string;

  /**
   * The important message you need to devliever to your user.
   * If an array is supplied, each item will be wrapped in an paragraph.
   */
  @Prop({ attribute: 'message' })
  displayMessage: string | string[];

  @Prop()
  onaffirm = noop

  @Prop()
  onreject = noop

  // @Listen('affirm')
  // @Listen('reject')
  // callAlternative(ev) {
  //   switch (ev.type) {
  //     case 'affirm': this.onaffirm(); break;
  //     case 'reject': this.onreject(); break;
  //     default: break;
  //   }
  // }

  /**
   * Event and static prop to define what happens when the user
   * wants to proceed.
   * This may be the "apply", or "ok" button, it's usually also theme="primary"
   * You can listen on this actions usinmg "affirm".
   */
  @Event()
  affirm: EventEmitter;

  /**
   * Event and static prop to define what happens when the user does NOT
   * want to proceed.
   * This may be the "cancel", or "reset" button, it's usually is rendered with default styles.
   * You can listen on this actions usinmg "reject".
   */
  @Event()
  reject: EventEmitter;

  /**
   * If provided, this value is used to render the default, positive button.
   * Only needed to overwrite the text, you can also overwrite the whole button
   * if you define "data-positive" as attribute inside your slot named action.
   */
  @Prop({ attribute: 'text-positive' })
  displayPositiveText: string;

  /**
   * If provided, this value is used to render the default, negative button.
   * Only needed to overwrite the text, you can also overwrite the whole button
   * if you define "data-negative" as attribute inside your slot named action.
   */
  @Prop({ attribute: 'text-negative' })
  displayNegativeText: string;

  /**
   * Not only can you overwrite the texts and buttons that are present by default,
   * using this prop you are also be able to exclude certain actions.
   * E.g. Dialogs.alert() will omit the negative action.
   */
  @Prop({ attribute: 'omit' })
  omittedActions: string | string[] = []

  private contentID: string = randomID();

  private titleID: string = randomID();

  /**
   * Show's an closing-X at the top right.
   */
  @Prop()
  closingX = false;

  private modal: HTMLDivElement;

  constructor() {
    // ModalController may take control over your instance!
    // This is to ensure proper usage between multiple modals (or dialogs!) above eachother.s
    const ctrl = ModalController.getInstance();
    ctrl.registerInstance(this);
  }

  @Watch('omittedActions')
  validateOmittedActions(newValue) {
    if (typeof newValue === 'string') {
      this.omittedActions = newValue.split(',');
    } else {
      this.omittedActions = newValue;
    }
  }

  private readonly defaultActions = {
    positive: () => (
      <msc-button data-positive theme="primary">
        {String(
          this.displayPositiveText
          || Translations.dialogs.defaultActions.positive,
        )}
      </msc-button>
    ),
    negative: () => (
      <msc-button data-negative>
        {String(
          this.displayNegativeText
          || Translations.dialogs.defaultActions.negative,
        )}
      </msc-button>
    ),
  };

  /**
   * *** DO NOT SET THIS VALUE BY HAND; THIS IS READONLY/INITIAL ASSIGNMENT ***
   * If you're using a framework, you can set it. Otherwise, no.
   * Call myModal.toggle() in html. Designed for JSX assignment.
   */
  @Prop()
  isVisible = false;

  /**
   * Custom event that gets triggered whenever this instance changes it's `isVisible`
   * property.
   * Access the value using `detail`.
   * Access the modal using `target`.
   */
  @Event({
    eventName: 'modal-toggled',
    bubbles: true,
    cancelable: false,
  })
  visibllityEmitter: EventEmitter;

  @Watch('isVisible')
  dispatchModalToggledEvent(newState) {
    ensureColorContrastFor(this.modal);
    this.visibllityEmitter.emit(newState);
  }


  /**
   * Closes the modal, even if it's already closed.
   */
  @Method()
  async close() {
    this.toggle(false);
  }

  /**
   * Opens the modal, even if it's already open.
   */
  @Method()
  async open() {
    this.toggle(true);
  }

  /**
   * Invert's the current visibillity state.
   * But you can also define a specific visibillity state as argument,
   * but might wanna try `show()` or `close()` first.
   * @param newState The new forcefully defined state
   */
  @Method()
  async toggle(newState = !this.isVisible) {
    this.isVisible = newState;
  }

  componentDidUpdate() {
    if (this.isVisible) {
      this.host.focus();
    }
  }

  private handleActionClick = (ev: MouseEvent) => {
    const target = ev.target as HTMLUnknownElement;
    const isClickForAction = (type) => target.matches(`[data-${type}]`);

    // NOTE: If an target has both, prefer negative, but don't just stop
    // after the first callback.
    if (isClickForAction('negative')) {
      this.pipeReject();
    }

    if (isClickForAction('positive')) {
      this.pipeAffirm();
    }
  };

  pipeAffirm = () => {
    this.affirm.emit();
    this.onaffirm();
  }

  pipeReject = () => {
    this.reject.emit();
    this.onreject();
  }

  private renderMessage() {
    if (this.displayMessage instanceof Array) {
      return this.displayMessage.map((message) => <p>{message}</p>);
    }

    return <p>{this.displayMessage}</p>;
  }

  private renderDefaultActions() {
    const defaultActionsThatNeedToBeRendered = [];

    const has = (type) => this.host.querySelector(`[slot="actions"] [data-${type}]`);

    const isOmitted = (type) => (typeof this.omittedActions === 'string'
      ? this.omittedActions === type
      : this.omittedActions.indexOf(type) >= 0);

    const includeIfNotProvidedButOnlyIfNotOmitted = (type) => {
      if (has(type) === null) {
        if (!isOmitted(type)) {
          defaultActionsThatNeedToBeRendered.push(this.defaultActions[type]());
        }
      }
    };

    includeIfNotProvidedButOnlyIfNotOmitted('negative');
    includeIfNotProvidedButOnlyIfNotOmitted('positive');

    return defaultActionsThatNeedToBeRendered;
  }

  componentWillLoad() {
    this.validateOmittedActions(this.omittedActions);

    nativeWindowEffectsFor(this.host, {
      forceclose: () => this.reject.emit(),
    });
  }

  render() {
    const hasTitle = Boolean(this.displayTitle);
    const hasMessage = Boolean(this.displayMessage);
    const hasClosingX = Boolean(this.closingX);

    return (
      <Host
        onClick={this.handleActionClick}
        tabIndex={0}
        aria-hidden={String(!this.isVisible)}
        style={{ display: this.isVisible ? '' : 'none', position: this.global ? 'fixed' : '' }}
        aria-labelledby={this.titleID}
        aria-describedby={this.contentID}
      >
        <div class="backdrop" />
        <div class="modal" ref={ref => this.modal = ref}>
          {hasTitle ? <h5 id={this.titleID}>{String(this.displayTitle)}</h5> : null}
          {hasClosingX ? (
            <msc-button class="window-close" theme="minimal" onClick={this.pipeReject}>
              <msc-icon name="close_window" />
            </msc-button>
          ) : null}
          <main id={this.contentID}>
            {hasMessage ? this.renderMessage() : null}
            <slot />
          </main>
          <footer>
            <div class="start">
              <slot name="alternativeActions" />
            </div>
            <msc-button-group class="end">
              <slot name="actions" />
              {this.renderDefaultActions()}
            </msc-button-group>
          </footer>
        </div>
      </Host>
    );
  }
}
