import { IModel } from './api/model.interface';

const circularReferenceReplacer = (_key, value, cache) => {
  if (!_key) {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    if (cache.indexOf(value) !== -1) {
      // Duplicate reference found, discard key
      return;
    }
    // Store value in our collection
    cache.push(value);
  }
  // eslint-disable-next-line consistent-return
  return value;
};

export function toJSON<T>(modelInstance: T) {
  const pure = modelInstance instanceof Array
    ? [...modelInstance]
    : { ...modelInstance };

  let cache = [];
  const returnValue = JSON.stringify(
    pure,
    (k, v) => circularReferenceReplacer(k, v, cache),
  );
  cache = null;

  return returnValue;
}

export function parseJSON<R = any>(json: string): R {
  return JSON.parse(json);
}
export function fromObject<T = IModel>(
  modelClass: { new(obj?): T },
  obj: { [P in keyof T]?: T[P] },
): T {
  // eslint-disable-next-line new-cap
  return new modelClass(obj);
}

export function parseLaxFromString(pureJsonLike: string) {
  // TODO: if you want comment support, extend this transformer

  const jsonLike = pureJsonLike
    .replace(/'/gi, '"')
    .replace(/([\w\d_-]+):/gi, (_match, keyName) => `"${keyName}":`)
    .replace(
      /:[\s]*((?!({|null|\d+|true|false))[^\s,}]*)/gi,
      (_match, nonConformingValueToString) => `:"${nonConformingValueToString}"`,
    );

  return parseJSON(jsonLike);
}


const RemapperService = {
  toJSON,
  parseLaxFromString,
  parseJSON,
  fromObject,
};

/**
 * Static service
 */
export default RemapperService;
