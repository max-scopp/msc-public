/* eslint-disable react/jsx-props-no-spreading */
import { h } from '@stencil/core';

export default function LikeText({ instance, ...props }) {
  return (
    <input
      class={`input input--${instance.type}`}
      type={instance.type}
      name={instance.name}
      autocomplete={instance.autocomplete}
      {...props}
    />
  );
}
