import { Singleton } from '../../singleton';
import { IconSetDefinition, IconSetConfig, IconSet } from '../../core/icons';

let IconLogger;

/**
 * Used to register icon sets
 */
export default class IconService extends Singleton {
  private _setDefinitions = new Map<string, IconSetDefinition>();

  static defaultSet;

  static getInstance(): IconService {
    if (!IconService.instance) {
      IconLogger = LoggerService.extendNS('Icons');
      IconService.defaultSet = ApplicationService.defaultIconSet;
    }

    return super.getInstance();
  }

  resolve(setName = IconService.defaultSet, keyName) {
    if (!setName) {
      LoggerService.warn('No icon-set provided. Developent mode?');
      return null;
    }

    const iconSet = this._setDefinitions.get(setName);

    if (!iconSet) {
      throw new Error(`Unknown IconSet "${setName}", did you register it?`);
    }

    const desiredIcon = iconSet.icons[keyName];

    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (typeof desiredIcon === 'string') {
      const {
        baseClassName,
        tagName,
        isInlineSet = false,
      } = iconSet.configuration;

      if (isInlineSet) {
        // TODO: Support inline svg instances
      } else {
        return {
          class: [baseClassName, desiredIcon].join(' '),
          tag: tagName,
        };
      }
    } else if (desiredIcon instanceof SVGElement) {
      return {
        node: desiredIcon,
      };
    } else {
      IconLogger.warn(
        `Cannot find Icon under the set "${setName}" with the key "${keyName}".`,
      );
    }

    return null;
  }

  registerSet(iconSet: IconSet, configuration: IconSetConfig) {
    // eslint-disable-next-line @stencil/strict-boolean-conditions
    if (!configuration || !configuration.name) {
      throw new Error(
        'Unable to register IconSet, configuration missing or no name provided.',
      );
    }

    if (this._setDefinitions.has(configuration.name)) {
      throw new Error(`IconSet already registered ${configuration.name}`);
    }

    this._setDefinitions.set(configuration.name, {
      icons: iconSet,
      configuration,
    });
  }

  removeSet(name: string) {
    if (this._setDefinitions.has(name)) {
      this._setDefinitions.delete(name);
    } else {
      throw new Error(
        'Cannot remove a set whose name has not been registered previously.',
      );
    }
  }
}
