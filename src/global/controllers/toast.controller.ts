import { Singleton } from '../../singleton';
import { Components } from '../../components';

type Options = Partial<Components.MscToast>;

export class ToastController extends Singleton {
  globalContainer = document.createElement('msc-toast-container');

  spinner(message, options?) {
    const toast = document.createElement('msc-toast');
    toast.indicator = true;
    toast.message = message;
    Object.assign(toast, options);

    this.pushToGlobalContainer(toast);
    return toast;
  }

  show(message, title?, options: Options = {}) {
    const toast = document.createElement('msc-toast');
    toast.message = message;
    toast.messageTitle = title;
    Object.assign(toast, options);

    this.pushToGlobalContainer(toast);
    return toast;
  }

  warning(message, title?, options: Options = {}) {
    this.show(message, title, { ...options, state: 'warning' });
  }

  danger(message, title?, options: Options = {}) {
    this.show(message, title, { ...options, state: 'danger' });
  }


  info(message, title?, options: Options = {}) {
    this.show(message, title, { ...options, state: 'info' });
  }

  success(message, title?, options: Options = {}) {
    this.show(message, title, { ...options, state: 'success' });
  }

  private pushToGlobalContainer(toast: HTMLMscToastElement) {
    if (!document.contains(this.globalContainer)) {
      document.body.append(this.globalContainer);
    }

    this.globalContainer.addToast(toast);
    toast.addEventListener('close', () => this.globalContainer.removeToast(toast));
  }
}
