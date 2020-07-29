// eslint-disable-next-line no-var, import/no-mutable-exports
export var previouslyConstructedSingletons = {};

export interface StaticClassSingleton<T = Singleton> {
  new(): T;
  instance: T;
  getInstance(): T;
}

export abstract class Singleton {
  static instance;

  static getInstance(this) {
    if (!this.instance) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      this.instance = new this();

      // don't waste time adding the new instance to the instance-collection, just move on.
      setTimeout(() => {
        previouslyConstructedSingletons[this.name] = this.instance;
      });
    }

    return this.instance;
  }
}
