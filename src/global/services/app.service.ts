import {
  GlobalEnvironment,
  BaseConfiguration,
  AppTheme,
  Environments,
  Handicapitation,
  AppConfiguration,
} from '../../core/definitions';
import { Singleton } from '../../singleton';
// /<reference path="../types.d.ts" />

declare let global: any;

// eslint-disable-next-line no-underscore-dangle
const _global = (typeof window === 'undefined'
  ? global
  : window) as GlobalEnvironment;

export default class ApplicationService extends Singleton implements BaseConfiguration {
  [k: string]: unknown;

  readonly theme: AppTheme;

  readonly baseUrl: string;

  readonly basePath: string;

  readonly appName: string;

  readonly apiRootPath: string;

  readonly defaultIconSet: string;

  readonly environment: Environments;

  readonly handicap: false | Handicapitation;

  static instance: ApplicationService;

  constructor(initialConfiguration: AppConfiguration) {
    super();

    Object.assign(this, new BaseConfiguration(), initialConfiguration);
  }

  get isDevelopment(): boolean {
    return this.environment !== 'production';
  }

  get isProduction(): boolean {
    const knownGoodDevEnvs = Object.keys(Environments).filter(
      (env) => env !== 'production',
    );

    return knownGoodDevEnvs.indexOf(this.environment) === -1;
  }

  static getInstance(): ApplicationService {
    if (!ApplicationService.instance) {
      const { __appConfig: config } = _global;
      ApplicationService.instance = new ApplicationService(config);
    }

    return super.getInstance();
  }
}
