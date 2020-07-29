// eslint-disable-next-line
// @ts-ignore
export function noop(...anyArgs: any[]) {
  return undefined;
}

export function lazy(...calls) {
  return new Promise((resolve) => {
    const resolved = [];
    calls.forEach(async (call, _index, all) => {
      setTimeout(async () => {
        await call();
        resolved.push(1);
        if (resolved.length === all.length) {
          resolve();
        }
      });
    });
  });
}

/**
 * Makes updates - in relation to requestAnimationFrame, less work-heavy by delaying
 * the work.
 * The question is, how many frames will you skip? Here's the Math:
 * Hz / MsInS * Throtted / Hz
 * So on a 60Hz monitor this function will update the data for rendering every 30th frame,
 * rather than in every frame.
 * @param target
 * @param work
 * @param throttled
 */
export function lazifyKeepElementUpdated(target, work, throttled = 120) {
  let intervalID;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const apply = () => {
    requestAnimationFrame(() => {
      work();
    });
  };

  intervalID = setInterval(apply, throttled);
  apply();

  return function stop() {
    clearInterval(intervalID);
  };
}

const seedMap = {};

function random(simple) {
  return simple
    ? Math.round(Math.random() * 1e6).toString(36)
    : `__rId${Math.round(Math.random() * 1e16).toString(36)}`;
}

/**
 * What the name says. Makes a random float value, moves the decimal places randomly
 * and stringifies it as base36.
 * Just something random that quite unlikely to repeat.
 * NOTICE: This is afaik the fastest solution. (3million op/s)
 * Optimized from (3x slower): https://gist.github.com/gordonbrander/2230317
 * EDIT: maybe not so fast with all these attribute parsing
 */
export function randomID(seedOrSimple?: string | number | boolean, _simple?: boolean) {
  type Seed = string | number;
  let seed = seedOrSimple;
  let simple = _simple;

  if (typeof (seedOrSimple) === 'boolean') {
    simple = seedOrSimple;
    seed = undefined;
  }


  if (seed) {
    const id = seedMap[seed as Seed] || random(simple);
    seedMap[seed as Seed] = id;
    return id;
  }

  return random(simple);
}

export function last<T = any>(_of: T[]) {
  return _of[_of.length - 1];
}

/**
 * Wat
 */
export function format(first: string, middle: string, last: string): string {
  return (
    (first || '')
    + (middle ? ` ${middle}` : '')
    + (last ? ` ${last}` : '')
  );
}

export function getGlobalCSSVariable(name: string): string {
  return getComputedStyle(window.document.body).getPropertyValue(`--${name}`);
}


export function hashify(_stringable: any) {
  let string = _stringable;
  let hash = 0;
  let i;
  let chr;

  if (typeof _stringable !== 'string') {
    string = JSON.stringify(_stringable);
  }

  // eslint-disable-next-line no-plusplus
  for (i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    // eslint-disable-next-line no-bitwise
    hash = ((hash << 5) - hash) + chr;
    // eslint-disable-next-line no-bitwise
    hash |= 0;
  }

  return hash.toString(36);
}
