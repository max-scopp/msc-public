import { h } from '@stencil/core';

import { AnyComponent } from '../../definitions';
import { randomID } from '../general';
import { createElement } from '../vdom/create-element'; import { JSX, FunctionalComponent } from '@stencil/core';

const linkStyles = {
  all: 'unset',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
}

/**
 * TODO: Document me! :) (or refactor to remove)
 * @param param0 
 */
function linkWrap({
  // eslint-disable-next-line
  children = null, noWrapper = false, linkText = '', ...additionalAnchorProps
}) {
  if (noWrapper) {
    return [
      // eslint-disable-next-line react/jsx-props-no-spreading
      <a href="#no-link"
        aria-hidden="true"
        {...additionalAnchorProps}
        style={linkStyles}
      >
        {linkText}
      </a>,
      children,
    ];
  }

  return (
    <span class="link-wrapper">
      {children}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <a href="#no-link" aria-hidden="true" {...additionalAnchorProps}>{linkText}</a>
    </span>
  );
}

interface AnchorProps {
  href?: string;
  [additionalAnchorProps: string]: any;
}

/**
 * HOC to make children(s) linked. 
 * **If an anchor is created, it will be positioned absolutely!**
 * See stylesheet and your component styles in which you use this function.
 * Make sure it's `position: relative` to span the correct parent scope.
 * @param anchor
 * @param additionalAnchorProps
 */
export function AnchorElementIfNeeded<T extends AnyComponent>(
  props: AnchorProps,
  children: JSX.Element
) {
  const { href: anchor, ...additionalAnchorProps } = props;

  return anchor ? linkWrap({
    href: anchor,
    children,
    tabIndex: -1,
    noWrapper: true,
    ...additionalAnchorProps,
  }) : children;
}
