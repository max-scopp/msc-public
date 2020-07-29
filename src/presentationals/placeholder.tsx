import { h } from '@stencil/core';

export function Placeholder(props, children) {
  const placeholderText = String(children);
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <span class="placeholder" role="presentation" {...props}>{placeholderText}</span>
  );
}
