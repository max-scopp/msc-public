import { AnyObject } from '../../definitions';
import { noop } from '../general';
import { Components } from '../../../components';

function createDialog({
  title = 'NoTitle',
  message = 'NoMessage',
  onAffirm = noop,
  onReject = noop,
  textPositive = null,
  textNegative = null,
  ...otherOverwrites
}): void {
  const dialog = document.createElement('msc-modal') as HTMLMscModalElement;

  function handle(type: () => void) {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    return () => {
      dialog.close();

      if (typeof type === 'function') {
        type();
      }

      setTimeout(() => {
        dialog.remove();
        console.log('Removed');
      });
      return 0;
    };
  }

  dialog.displayTitle = title;
  dialog.displayMessage = message;
  dialog.displayPositiveText = textPositive;
  dialog.displayNegativeText = textNegative;
  dialog.role = 'alertdialog';

  dialog.onaffirm = handle(onAffirm);
  dialog.onreject = handle(onReject);

  Object.assign(dialog, otherOverwrites);

  dialog.open();
  document.body.append(dialog);
}

/**
 * Our own implementation of window.alert
 * @param message The message to present the user
 * @param dialogExtension Extend msc-modal
 */
export function alert(
  message: string,
  dialogExtension: Partial<Components.MscModal>,
): void {
  createDialog({
    message,
    title: Translations.alert.defaultTitle,
    omittedActions: ['negative'],
    ...dialogExtension,
  });
}

/**
 * Our own implementation of window.confirm
 * This function async, because the feature is non-blocking
 * @param question The question to ask the user
 * @param dialogExtension Extend msc-modal
 */
export async function confirm(
  question = Translations.confirm.defaultMessage,
  dialogExtension: AnyObject,
): Promise<boolean> {
  return new Promise((resolve) => {
    createDialog({
      message: question,
      title: Translations.confirm.defaultTitle,
      textPositive: Translations.confirm.defaultPositive,
      textNegative: Translations.confirm.defaultNegative,
      onAffirm: () => resolve(true),
      onReject: () => resolve(false),
      ...dialogExtension,
    });
  });
}
