import { Singleton } from '../../singleton';
import { alert, confirm } from '../../core/utils/ui-helpers';

/**
 * This is a wrapper Service.
 * (⌐ ͡■ ͜ʖ ͡■)
 */
export default class DialogService extends Singleton {
  // life' simple.
  confirm = confirm

  alert = alert
}
