import {
  Component,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Prop,
  State,
  Watch,
} from '@stencil/core';
import { debounce } from 'throttle-debounce';

import { FormElement, StringBoolean } from '../../core/definitions';
import BooleanLike from './like-boolean.presentational';
import TextLike from './like-text.presentational';
import { BaseInputType, BaseInputTypes } from './types';

@Component({
  tag: 'msc-input',
  styleUrl: 'msc-input.scss',
})
export class MscInput implements FormElement {
  /**
   * The value to display when there is no value.
   */
  @Prop()
  placeholder: string;

  /**
   * Should this input field autocomplete?
   * Ignored for type="radio" and type="checkbox"
   */
  @Prop()
  autocomplete: boolean | StringBoolean = false;

  /**
   * Under what name should the value be stored inside the form?
   */
  @Prop()
  name: string;

  /**
   * Is your input required?
   */
  @Prop()
  required: boolean | StringBoolean = false

  /**
   * Is your input disabled?
   */
  @Prop()
  disabled: boolean | StringBoolean;

  /**
   * The type of input you need.
   */
  @Prop()
  type: BaseInputType = BaseInputTypes.Text;

  /**
   * The value the component has/holds.
   */
  @Prop()
  value: any;

  @Watch('value')
  emitChange(newValue) {
    // this.host.value = newValue;
    this.change.emit(newValue);
  }

  /**
   * CustomEvent that dispatches when the content changes.
   */
  @Event({ eventName: 'userInput' })
  change: EventEmitter;

  @Element()
  host: HTMLMscInputElement;

  private focusTextField = () => {
    switch (this.type) {
      case 'text':
      case 'textarea':
      case 'password':
      case 'search':
      case 'email':
      case 'number':
      case 'url':
      case 'tel':
        this.host.querySelector('input').focus();
        break;
      default: break;
    }
  }

  componentWillLoad() {
    this.host.addEventListener('activate', this.handleClick);
    this.host.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const cloestForm = this.host.closest('form');
        if (cloestForm) {
          cloestForm.submit();
        }
      }
    });
  }

  private handleInput = (event: KeyboardEvent) => {
    const target = event.target as HTMLUnknownElement;

    switch (this.type) {
      case 'text':
      case 'textarea':
      case 'search':
      case 'email':
      case 'number':
      case 'url':
        this.value = target.textContent || (target as HTMLInputElement).value;
        break;
      default:
        LoggerService.warn(`msc-input: Cannot handle input, type "${this.type}" not implemented!`);
    }
  }

  debouncedInput = debounce(33, false, this.handleInput.bind(this));

  private handleClick = () => {
    switch (this.type) {
      case 'checkbox':
      case 'radio':
        if (typeof this.value === 'string') {
          this.value = this.value !== 'true';
        } else {
          this.value = !this.value;
        }
        break;
      default:
    }
  };

  private renderType() {
    const isChecked = String(this.value) !== 'false';

    switch (this.type) {
      case 'text':
      case 'textarea':
      case 'password':
      case 'search':
      case 'email':
      case 'number':
      case 'url':
      case 'tel':
        return (
          <TextLike
            instance={this}
            value={this.value}
            role={this.roleType}
            onKeyUp={this.debouncedInput}
            onKeyPress={this.debouncedInput}
            aria-required={String(this.required)}
            aria-autocomplete={String(this.autocomplete)}
            aria-multiline={String(this.type === 'textarea')}
            aria-selected={String(String(this.value) !== 'false')}
          >
            <slot />
          </TextLike>
        );
      case 'checkbox':
      case 'radio':
        return (
          <BooleanLike
            instance={this}
            role={this.roleType}
            checked={isChecked}
            aria-required={String(this.required)}
            aria-autocomplete={String(this.autocomplete)}
            aria-selected={String(isChecked)}
          >
            <slot />
          </BooleanLike>
        );

      default: {
        LoggerService.warn(`msc-input: Cannot render input, type "${this.type}" not implemented!`);
        return <slot />;
      }
    }
  }

  get roleType() {
    switch (this.type) {
      case 'text':
      case 'password':
      case 'textarea':
        return 'textbox';
      default: {
        LoggerService.warn(`msc-input: Cannot decide role, type "${this.type}" not implemented!`);
        return this.type;
      }
    }
  }

  render() {
    return (
      <Host tabIndex={-1} onFocus={this.focusTextField}>
        {this.renderType()}
      </Host>
    );
  }
}
