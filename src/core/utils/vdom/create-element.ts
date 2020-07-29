/* eslint-disable no-param-reassign */
import { JSX } from '@stencil/core';
import h from 'hyperscript';

import { noop } from '../general';

interface PrivateVNode {
  $tag$: string;
  $text$: null | string;
  /**
   * Used for diffing - we don't
   */
  $elm$: null;

  $children$: PrivateVNode[];
  $attrs$: { [key: string]: any };

  // stencil internals
  $key$: null;
  $name$: null;
  $flags$: 0;
}

function mapClassToClassName(classes) {
  if (classes instanceof Array) {
    return classes.join(' ');
  }

  switch (typeof classes) {
    default:
    case 'string': return classes;
    case 'function': return classes();
    case 'object': return Object.entries(classes)
      .map(([className, classCriteria]) => {
        if (classCriteria) {
          return className;
        }
        return '';
      }).join(' ');
  }
}

function remapAttributes(vNodeAttrs: PrivateVNode['$attrs$']) {
  if (vNodeAttrs) {
    Object.entries(vNodeAttrs).forEach(([attrName, attrValue]) => {
      switch (attrName) {
        case 'class':
          // eslint-disable-next-line dot-notation
          vNodeAttrs['className'] = mapClassToClassName(attrValue);
          break;
        default: break;
      }
    });
  }

  return vNodeAttrs;
}

/**
 * A fast and cheap way to render a vdom without stencil's influence.
 *
 * @param vnode
 * @param opts
 */
export function createElement(
  vnode: PrivateVNode | PrivateVNode[],
  ref?: HTMLElement,
): Element | Element[] {
  if (!vnode) {
    return;
  }

  if (vnode instanceof Array) {
    if (ref && !(ref instanceof Array)) {
      console.error('CRITICAL: ref type must equal to vNode!');
    }

    // eslint-disable-next-line consistent-return
    return vnode.map((vNode, i) => createElement(vNode, ref && ref[i]) as Element);
  }

  const newElement = h(
    vnode.$tag$,
    remapAttributes(vnode.$attrs$),
    vnode.$text$,
    ...(vnode.$children$ || []).map(($def) => createElement($def)),
  );

  if (vnode.$attrs$) {
    Object.keys(vnode.$attrs$).forEach(($attr$) => {
      switch ($attr$) {
        case 'ref':
          // eslint-disable-next-line no-case-declarations
          const func = vnode.$attrs$[$attr$];
          if (func && typeof func === 'function') {
            func(newElement);
          }
          break;
        default: break;
      }
    });
  }

  if (ref) {
    ref.replaceWith(newElement);
  }

  // eslint-disable-next-line consistent-return
  return newElement;
}
