import { Singleton } from '../../singleton';
import { last, lazy } from '../../core/utils/general';

export default class ModalController<
  T extends HTMLMscModalElement = HTMLMscModalElement
  > extends Singleton {
  componentInstances: T[] = [];

  visibleModals: T[] = [];

  constructor() {
    super();

    window.addEventListener('focus', this.rejectFocusEventsOutsideTopmostModal.bind(this), true);
    window.addEventListener('modal-toggled', this.handleVisibleModalStack.bind(this));
  }

  get topMostModal() {
    return last(this.visibleModals);
  }

  focusTopMostModal() {
    console.log('topMost', this.topMostModal);
    this.topMostModal.focus();
  }

  rejectFocusEventsOutsideTopmostModal(ev: FocusEvent) {
    const target = ev.target as HTMLUnknownElement;

    if (target instanceof HTMLElement) {
      const topModal = this.topMostModal;

      if (topModal && !topModal.contains(target)) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        topModal.focus();
      }
    }

    if ((target as T).isVisible) {
      this.validateModalExistance(target as T, (target as T).isVisible);
    }
  }

  handleVisibleModalStack(ev: CustomEvent) {
    const { target, detail: modalState } = ev;
    this.validateModalExistance(target as T, modalState);
  }

  validateModalExistance(modal: T, state: boolean) {
    if (state === true) {
      this.visibleModals.push(modal as T);
    } else {
      this.visibleModals = this.visibleModals.filter(
        (wasVisibleModal) => wasVisibleModal !== modal,
      );
      if (this.visibleModals.length) {
        this.focusTopMostModal();
      } else {
        lazy(() => {
          // TODO: Here is still a bug where focus sequence is reset, but
          // chrome does not properly set internal focus for the webpage.
          document.body.blur();
          console.log('blur');
          lazy(() => {
            console.log('focus=???');
            window.focus();
          });
        });
      }
    }
  }

  registerInstance(instance: T) {
    this.componentInstances.push(instance);
  }
}
