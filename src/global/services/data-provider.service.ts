import { Singleton } from '../../singleton';

type Data = { [k: string]: any };

let DataLogger;

export default class DataProvider extends Singleton {
  flatSource: Map<string, any> = new Map();

  sectionedSources: Map<string, Data> = new Map();

  awaiters: { func: Function; for: string }[] = [];

  static getInstance() {
    if (!DataProvider.instance) {
      DataLogger = LoggerService.extendNS('DataProvider');
    }

    return super.getInstance();
  }

  /**
   * Waits until provided section name or global key has been set.
   * Then, it will call the provided function with the first argument being the
   * value you where waiting for.
   *
   * ATTENTION: This function will always be called whenever a change occoured
   * to the matching global key or section.
   *
   * TODO: Refactor to split feature between:
   * - listen() for first setter and subsequent updates
   * - await() for ONLY the first setter
   *
   * NOTE: When refactoring, the await() listeners that shall only be
   *  called once, need to be removed when the first setter occoured.
   *
   * @param sectionOrKey
   * @param callback
   */
  await(sectionOrKey, callback) {
    this.awaiters.push({
      func: callback,
      for: sectionOrKey,
    });
  }

  /**
   * TODO: Refactor: split listener detection, section setters AND global setters into seperate functions.
   */
  define(dataOrSection: string | Data, _data?: Data) {
    let data = _data;
    let section = null;

    /* #region "figure out arguments"  */
    if (arguments.length > 2) {
      throw new Error(
        'You are trying to define data in an unconventional way!',
      );
    }

    if (typeof dataOrSection === 'string') {
      section = dataOrSection;
    } else {
      data = dataOrSection;
    }
    /* #endregion */

    if (section !== null) {
      const willBeUpdatingExistingData = this.sectionedSources.has(section);

      if (!willBeUpdatingExistingData) {
        this.sectionedSources.set(section, data);
      } else {
        const presentData = this.sectionedSources.get(section);
        const keysToBeUpdated = Object.keys(data).filter(
          (newKey) => presentData[newKey] !== undefined,
        );

        if (keysToBeUpdated.length) {
          DataLogger.info(
            `Updating an previously defined key(s) inside section "${section}", keys: ${JSON.stringify(
              keysToBeUpdated,
            )}`,
          );
        }

        this.sectionedSources.set(section, {
          ...presentData,
          ...data,
        });
      }

      const matchingAwaiters = this.awaiters.filter((awaitee) => awaitee.for === section);
      matchingAwaiters.forEach((awaiter) => awaiter.func(data));
    } else {
      const keysToInsert = Object.keys(data);

      if (keysToInsert.length) {
        keysToInsert.forEach((key) => {
          if (this.flatSource.has(key)) {
            DataLogger.info(`Updating value "${key}" on a global scope.`);
          }

          this.flatSource.set(key, data[key]);
        });
      } else {
        DataLogger.warn(
          'You are trying to define data where no data was provided!',
        );
      }

      const matchingAwaiters = this.awaiters.filter((awaitee) => keysToInsert.indexOf(awaitee.for) >= 0);
      matchingAwaiters.forEach((awaiter) => awaiter.func(data));
    }
  }

  resolve(key: string, section?: string) {
    if (section) {
      const bucket = this.sectionedSources.get(section);
      return bucket[key];
    }
    return this.flatSource.get(key);
  }

  getStore() {
    const finalObject = {};

    const addItem = (value, key) => {
      finalObject[key] = value;
    };

    this.flatSource.forEach(addItem);
    this.sectionedSources.forEach(addItem);

    return finalObject;
  }
}
