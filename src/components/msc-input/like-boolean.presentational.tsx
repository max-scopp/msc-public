/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { h } from '@stencil/core';
import { FormElement } from '../../core/definitions';

export default function LikeBoolean({ instance, ...props }, children) {
  return [
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div tabIndex={0} class={[`input__toggle--${instance.type}`, (instance as FormElement<boolean>).value ? 'is-checked' : ''].join(' ')} {...props}>
      {instance.type === 'checkbox' ? (
        <span class={`input--${instance.type}`}>
          <msc-icon name="check" />
        </span>
      ) : <span class={`input--${instance.type}`} />}
    </div>,
    <input type="hidden" value={instance.value} name={instance.name} />,
    <span class="input__value">{children}</span>,
  ];
}
