import { h } from '@stencil/core';

export function TextFragment(props, children) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <span {...props} aria-hidden="true" class="msc-u-pe-n">
      {children}
    </span>
  );
}
