import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, Watch } from '@stencil/core';

import { ensureColorContrastFor, randomID } from '../../core/utils';
import { ToastStateType, ToastStateTypes } from './types';

function Indicator({ id, message }) {
  return [
    <msc-tooltip position="left" label={message} for={id} />,
    <svg id={id} width="26px" height="26px" viewBox="0 0 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g id="cogs" fill="currentColor" fill-rule="nonzero">
        <path d="M13.5916757,16.45 C14.9416757,16.45 16.0416757,15.35 16.0416757,14 C16.0416757,12.65 14.9416757,11.55 13.5916757,11.55 C12.2316757,11.55 11.1416757,12.65 11.1416757,14 C11.1416757,15.35 12.2316757,16.45 13.5916757,16.45 M18.7916757,14.68 L20.2716757,15.84 C20.4016757,15.95 20.4416757,16.13 20.3516757,16.29 L18.9516757,18.71 C18.8616757,18.86 18.6916757,18.92 18.5216757,18.86 L16.7816757,18.16 C16.4216757,18.44 16.0216757,18.67 15.6016757,18.85 L15.3316757,20.7 C15.3116757,20.87 15.1616757,21 14.9916757,21 L12.1916757,21 C12.0116757,21 11.8716757,20.87 11.8416757,20.7 L11.5816757,18.85 C11.1516757,18.67 10.7616757,18.44 10.4016757,18.16 L8.6516757,18.86 C8.5016757,18.92 8.3116757,18.86 8.2316757,18.71 L6.8316757,16.29 C6.7416757,16.13 6.7816757,15.95 6.9116757,15.84 L8.3916757,14.68 L8.3416757,14 L8.3916757,13.31 L6.9116757,12.16 C6.7816757,12.05 6.7416757,11.86 6.8316757,11.71 L8.2316757,9.29 C8.3116757,9.13 8.5016757,9.07 8.6516757,9.13 L10.4016757,9.84 C10.7616757,9.56 11.1516757,9.32 11.5816757,9.15 L11.8416757,7.29 C11.8716757,7.13 12.0116757,7 12.1916757,7 L14.9916757,7 C15.1616757,7 15.3116757,7.13 15.3316757,7.29 L15.6016757,9.15 C16.0216757,9.32 16.4216757,9.56 16.7816757,9.84 L18.5216757,9.13 C18.6916757,9.07 18.8616757,9.13 18.9516757,9.29 L20.3516757,11.71 C20.4416757,11.86 20.4016757,12.05 20.2716757,12.16 L18.7916757,13.31 L18.8416757,14 L18.7916757,14.68" id="big-cog" />
        <path d="M4.3816757,6.07 C5.2516757,6.07 5.9516757,5.37 5.9516757,4.5 C5.9516757,3.63 5.2516757,2.92 4.3816757,2.92 C3.5090658,2.92 2.8016757,3.6273901 2.8016757,4.5 C2.8016757,5.37 3.5116757,6.07 4.3816757,6.07 M7.7216757,4.94 L8.6916757,5.68 C8.7616757,5.75 8.7816757,5.87 8.7216757,5.97 L7.8216757,7.53 C7.7716757,7.63 7.6516757,7.67 7.5516757,7.63 L6.4316757,7.18 L5.6916757,7.62 L5.5016757,8.81 C5.4816757,8.92 5.3916757,9 5.2816757,9 L3.4816757,9 C3.3616757,9 3.2716757,8.92 3.2516757,8.81 L3.0916757,7.62 L2.3316757,7.18 L1.1916757,7.63 C1.1016757,7.67 0.991675704,7.63 0.931675704,7.53 L0.0316757035,5.97 C-0.0283242965,5.87 0.00167570351,5.75 0.0816757035,5.68 L1.0316757,4.94 L1.0016757,4.5 L1.0316757,4.06 L0.0816757035,3.32 C0.00167570351,3.25 -0.0283242965,3.13 0.0316757035,3.03 L0.931675704,1.47 C0.991675704,1.37 1.1016757,1.33 1.1916757,1.37 L2.3216757,1.82 L3.0916757,1.38 L3.2516757,0.19 C3.2716757,0.08 3.3616757,0 3.4816757,0 L5.2816757,0 C5.3916757,0 5.4816757,0.08 5.5016757,0.19 L5.6916757,1.38 L6.4316757,1.82 L7.5516757,1.37 C7.6516757,1.33 7.7716757,1.37 7.8216757,1.47 L8.7216757,3.03 C8.7816757,3.13 8.7616757,3.25 8.6916757,3.32 L7.7216757,4.06 L7.7516757,4.5 L7.7216757,4.94 Z" id="small-cog" />
      </g>
    </svg>,
  ];
}

@Component({
  tag: 'msc-toast',
  styleUrl: 'msc-toast.scss',
})
export class MscToast {
  /**
   * How long the toast shall be visible. Use a falsy value for no timeout.
   */
  @Prop()
  timeout: number | false = 5e3;

  @Element()
  host: HTMLMscToastElement;

  private timeoutID;

  /**
   * If true, toast will be gone when clicked.
   */
  @Prop()
  dismissable = true;

  id = randomID();

  @Watch('timeout')
  validateTimeout(newValue) {
    if (typeof newValue !== 'number') {
      this.timeout = parseInt(newValue, 10) || null;
      this.startTimeout();
    }
  }

  startTimeout() {
    this.timeoutID = setTimeout(() => this.dismiss(), Number(this.timeout));
  }

  componentDidLoad() {
    ensureColorContrastFor(this.host);
  }

  disconnectedCallback() {
    clearTimeout(this.timeoutID);
  }

  componentWillLoad() {
    if (this.indicator) {
      this.timeout = null;
      this.dismissable = false;
    }

    if (this.timeout) {
      this.startTimeout();
    }

    this.host.addEventListener('click', () => {
      if (this.dismissable) {
        this.dismiss();
      }
    });
  }

  /**
   * CLose event when dismissed
   */
  @Event({ eventName: 'close' })
  close: EventEmitter;

  /**
   * Removes the toast
   */
  @Method()
  async dismiss() {
    this.close.emit();
    this.host.remove();
  }

  /**
   * If true, only the most important things are rendered to make the toast work.
   * Pure extendabillity for your!
   */
  @Prop()
  indicator = false;

  /**
   * A small string that's rendered <**bold** />
   */
  @Prop({ attribute: 'message-title' })
  messageTitle: string;

  /**
   * The message to show in the Toast.
   */
  @Prop()
  message: string;

  /**
   * Visual state how the tosat looks
   */
  @Prop()
  state: ToastStateType = ToastStateTypes.Normal;

  render() {
    const hasMessage = Boolean(this.message);
    const hasTitle = Boolean(this.messageTitle);
    return (
      <Host style={{ '--time': `${this.dismissable ? `${this.timeout}ms` : ''}` }} class={{ 'toast--indicator': this.indicator, [`toast--${this.state}`]: Boolean(this.state), 'not-dismissable': !this.dismissable }}>
        {!this.indicator ? (
          [
            <div class="icon">
              <slot name="icon" />
            </div>,
            hasTitle ? <b>{this.messageTitle}</b> : null,
            hasMessage ? <p>{this.message}</p> : null
          ]
        ) : <Indicator id={this.id} message={this.message} />}
        <slot />
      </Host >
    );
  }
}
