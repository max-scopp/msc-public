/* eslint-disable no-console */
/* eslint-disable @stencil/ban-side-effects */
import _debug from 'debug';

import { Singleton } from '../../singleton';
import { noop } from '../../core/utils/general';

export type LoggerFunction = ((...args) => void) & {
  extend: Function;
  log: Function;
};

const noopLogger = Object.assign(() => undefined, {
  extend: noop,
  log: noop,
}) as LoggerFunction;

interface LoggerOverwritables {
  stdout?: LoggerFunction;
  stderr?: LoggerFunction;
}

let enableLogging = false;

/**
 * This Logger supports the writing of printf formatting, even Objects!
 * https://en.wikipedia.org/wiki/Printf_format_string
 */
export default class LoggerService extends Singleton {
  stdout: LoggerFunction;

  stderr: LoggerFunction;

  private consoleWarn: LoggerFunction;

  private consoleInfo: LoggerFunction;

  constructor(overwrites: LoggerOverwritables = {}) {
    super();

    enableLogging = ApplicationService.isDevelopment;

    if (enableLogging) {
      _debug.enable('*');
      if (overwrites.stdout) {
        this.stdout = overwrites.stdout;
      } else {
        this.stdout = _debug(ApplicationService.appName.toLowerCase());
      }

      if (overwrites.stderr) {
        this.stderr = overwrites.stderr;
      } else {
        this.stderr = _debug(ApplicationService.appName.toLowerCase());
      }

      this.stdout.log = console.log.bind(console);
      this.stderr.log = console.error.bind(console);

      this.consoleInfo = this.stdout;
      this.consoleInfo.log = console.info.bind(console);

      this.consoleWarn = this.stderr.extend('warn');
      this.consoleWarn.log = console.warn.bind(console);
    } else {
      this.stderr = noopLogger;
      this.stdout = noopLogger;
      this.consoleInfo = this.stdout;
      this.consoleWarn = this.stderr;
      this.deprecate = noop;
      this.group = noop;
    }
  }

  extendNS(ns: string) {
    const stdout = this.stdout.extend(ns);
    const stderr = this.stderr.extend(ns);

    const newInstance = new LoggerService({
      stdout,
      stderr,
    });

    return newInstance;
  }

  group(groupTitle: string, logs: (logger: this) => void, ...groupStyles: string[]) {
    console.group(
      `${groupTitle} %c(click to show)`,
      ...groupStyles, 'color: gray; font-style: italic',
    );
    logs(this);
    console.groupEnd();
  }

  deprecate(deprecationNotice: string, source) {
    console.groupCollapsed(
      `DEPRECATED: ${deprecationNotice} %c(click to show source)`, 'color: gray; font-style: italic',
    );
    this.log(source);
    console.groupEnd();
  }

  log(...args) {
    this.stdout(...args);
  }

  info(...args) {
    this.consoleInfo('%ci', [
      'font-style: italic',
      'font-weight: bold',
      'font-size: 80%',
      'background: #3d53cf',
      'color: #FFF',
      'padding: .2em .5em',
      'border-radius: 100%',
    ].join(';'), ...args);
  }

  warn(...args) {
    this.consoleWarn(...args);
  }

  error(...args) {
    this.stderr(...args);
  }
}
