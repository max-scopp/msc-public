export enum Environments {
  Production = 'production',
  Developmnt = 'development',
  Testing = 'staging'
}
export interface Handicapitation {
  visuallyImpaired: boolean;
  highContrast: boolean;
}

export enum AppTheme {
  Light,
  Dark
}

export interface GlobalEnvironment {
  __appConfig: AppConfiguration;
}

export interface AppConfiguration extends Partial<BaseConfiguration> {
  // require one, but also have an fallback
  appName: string;
  baseUrl: string;
  basePath: string;
  apiRootPath: string;
}

export class BaseConfiguration {
  // have an default appName
  appName = 'App';

  baseUrl = location.href;

  theme: AppTheme = AppTheme.Light;

  defaultIconSet = null;

  environment: Environments = Environments.Production;

  handicap: false | Handicapitation = false;
}
