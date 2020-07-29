import { Singleton } from '../../singleton';

declare let window: WindowHasTranslations & WithTranslations;

/**
 * Placeholders!
 */
// eslint-disable-next-line @typescript-eslint/no-empty-function
function NoTranslationAvailable() { }

export default class TranslationService extends Singleton {
  constructor(translations: { [key: string]: any }) {
    super();
    // apply all translations to this instance.
    Object.assign(this, translations);
  }

  static getInstance() {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService(window.__appTranslations);
    }

    return super.getInstance();
  }

  /**
   * Returns a specific part of a translation type ("section").
   * Can be called recursively called recursively.
   * @param key
   * @param section
   * @param path
   */
  resolve(key, section?, path = []) {
    let returnValue = NoTranslationAvailable;

    // store for later use, e.g. displaying the full non-working path (see emptyAccessor)
    path.push(key);

    if (section && section !== NoTranslationAvailable) {
      returnValue = section[key];
    } else if (this[key]) {
      returnValue = this[key];
    } else {
      returnValue = section;
    }

    return {
      returnValue: returnValue || NoTranslationAvailable,
      path,
      resolve: (_key, _section) => this.resolve(_key, _section, path),
    };
  }
}

/**
 * Removes private and internal keys.
 * E.g. _myPrivate or $myPrivateStream$
 * @param path
 */
function cleanPath(path: string[]) {
  return path.filter((value) => !/^[$_]/.test(value)).join('.');
}

/**
 * Used when TranslationService can no longer resolve your translation.
 * This Proxy prevents app-crashes and if converted to a string, the full
 * accessor path will be rendered (see toString)
 * @param path
 */
const createEmptyAccessor = (path: string[] = []) => {
  const emptyAccessor = new Proxy({
    // this may be called implcitly
    toString: () => `["${cleanPath(path)}"]`,
  }, {
    get: (target, name) => {
      // if it's a symbol, chrome signifies to represent
      // the Proxied object as primitive type.
      // Which we can't do, because we're nothing.
      // So better call toString() which will inform the developer
      // for the missing translation path.
      if (name === 'toString' || typeof name === 'symbol') {
        return target.toString;
      }

      // Continue to collect accessor names until we'd like
      // to stringify it, or represent as primitive.
      path.push(String(name));
      return emptyAccessor;
    },
  });

  return emptyAccessor;
};

function goDeeper({ returnValue, path, resolve }) {
  // If we get another object back, we haven't hit our target, yet.
  if (returnValue && returnValue.constructor === Object) {
    return new Proxy(returnValue, {
      get: (currentSection, name) => goDeeper(resolve(name, currentSection)),
    });
  }
  // Looks like we hit our target. But does it actually exist?
  if (returnValue !== NoTranslationAvailable) {
    return returnValue;
  }

  // Aparently not. Let's investigate the path further.
  return createEmptyAccessor(path);
}

// explicit any, because it can actually return anything.
// But this is mainly here so the IDE doesn't complain about
// XYZ does not exist on "TranslationService" (the class above)

export const Translations: any = new Proxy(TranslationService, {
  get: (_target, name) => {
    const serviceInstance = TranslationService.getInstance();
    return goDeeper(serviceInstance.resolve(name));
  },
});

interface WindowHasTranslations {
  __appTranslations: { [key: string]: string };
}

interface WithTranslations extends Window {
  Translations: typeof Translations;
}

// eslint-disable-next-line @typescript-eslint/camelcase
window.__appTranslations = window.__appTranslations || {};


window.Translations = Translations;
