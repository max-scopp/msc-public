import './global/expose-global';

import { Build } from '@stencil/core';

import { ensureColorContrastFor } from './core/utils/contrast';
import {
  appendGlobalProgressIndicator,
  makeOnClickAccessible,
  provideEventsDebugger,
  redirectInteractionToUniversialEvent,
  setupFocusOutline,
} from './global/side-effects';

function dispatchReady() {
  document.body.dispatchEvent(
    new CustomEvent('msc-done', { bubbles: true }),
  );
}

export default async () => {
  if (Build.isDev) {
    provideEventsDebugger(window);
  }

  redirectInteractionToUniversialEvent();
  makeOnClickAccessible();

  window.addEventListener('DOMContentLoaded', () => {
    setupFocusOutline();
    ensureColorContrastFor(document.body, true);
    appendGlobalProgressIndicator();
  });

  switch (document.readyState) {
    case 'loading':
    case 'interactive':
      window.addEventListener('load', dispatchReady);
      break;
    default:
      dispatchReady();
  }
};
