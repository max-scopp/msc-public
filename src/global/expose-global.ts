import { previouslyConstructedSingletons, StaticClassSingleton } from '../singleton';
import { IconSet } from '../core/icons';
import { lazy } from '../core/utils/general';
import {
  AccessibilityService,
  ApiService,
  ApplicationService,
  DataProvider,
  DialogService,
  IconService,
  LoggerService,
  StorageService,
} from './services';
import * as Controllers from './controllers';
import { Translations } from './services/translation.service';

declare let window: Window & { [k: string]: any };

function resolveSingleton(_class) {
  const isSingleton = typeof (_class as any).getInstance === 'function';
  return isSingleton ? (_class as StaticClassSingleton).getInstance() : _class;
}

const globalExportStruct = {
  ApplicationService: ApplicationService,
  LoggerService: LoggerService,

  DataProvider: DataProvider,
  ApiService: ApiService,
  StorageService: StorageService,

  Dialog: DialogService,

  IconService: IconService,
  IconSet: IconSet,

  Controller: {//TODO: Refactor
    Modal: resolveSingleton(Controllers.ModalController) as Controllers.ModalController,
    Toast: resolveSingleton(Controllers.ToastController) as Controllers.ToastController,
  },

  Accessibility: AccessibilityService,
  Translations: Translations,
};

export {
  ApplicationService,
  LoggerService,

  DataProvider,
  ApiService,

  DialogService,

  IconService,
  IconSet,

  Controllers as Controller,

  AccessibilityService,
};

const GlobalInstances = Object.entries({
  ...globalExportStruct,
});

type ConstructableIconSet = typeof IconSet;

declare global {
  const configureStore;
  const getStore;

  const Controller: typeof globalExportStruct['Controller'];

  const Translations: any;

  const ApplicationService: ApplicationService;
  const LoggerService: LoggerService;
  const DataProvider: DataProvider;
  const ApiService: ApiService;
  const Dialog: DialogService;
  const Accessibility: AccessibilityService;
  const IconService: IconService;
  const IconSet: ConstructableIconSet;
}

const locallyExposed = {};


if (typeof window !== 'undefined') {
  GlobalInstances
    .map(([name, _class]) => {
      if (_class.constructor === Object) {
        const withResolvedSingletons = {};
        Object.keys(_class).forEach((childName) => {
          withResolvedSingletons[childName] = resolveSingleton(_class[childName]);
        });
        return [name, withResolvedSingletons];
      }
      return [name, _class];
    })
    .forEach(([name, _class]) => {
      const localClass = resolveSingleton(_class);
      const installClass = window[String(name)] || localClass;
      locallyExposed[String(name)] = installClass;
      window[String(name)] = installClass;
    });

  lazy(() => {
    document.dispatchEvent(new CustomEvent('msc-global', {
      bubbles: true,
    }));
  });
}

setTimeout(() => {
  const logger = LoggerService.getInstance();
  logger.group('Built ClassSingletonFactory', () => {
    logger.info('You can re-open the array below the table to see future instances that will be built at a later point in time.');
    logger.log(Object.values(previouslyConstructedSingletons));
  });

  logger.group('GlobalServices', () => {
    logger.log(Object.values(locallyExposed));
  });
});
