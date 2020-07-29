import { Model } from './model';
import { TypeOfValues } from './model.interface';

export abstract class ArrayModel<T, Array = T[]> extends Array implements Model {
  [k: number]: T;

  protected static readonly runtimeType: TypeOfValues;


  toObject<R = Array>(): R {
    if (this[0] && typeof this[0] !== typeof ArrayModel.runtimeType) {
      throw new Error('TypeMissmatch for parsed response! Model child type doesn\'t match.');
    }

    return [...this] as unknown as R;
  }

  toJSON(): string {
    // eslint-disable-next-line prefer-rest-params
    return Model.prototype.toJSON.apply(this, arguments);
  }

  toString() {
    return this.toJSON();
  }
}
