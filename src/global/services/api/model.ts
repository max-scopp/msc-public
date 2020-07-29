import { toJSON } from '../mapper.service';
import { IModel, TypeOfValues } from './model.interface';

export abstract class Model<T = any> implements IModel {
  protected static readonly runtimeType: TypeOfValues;

  constructor(fromObject?: T) {
    Object.assign(this, fromObject);
  }

  toObject<R = { [key: string]: T }>(): R {
    return { ...this } as unknown as R;
  }

  toJSON() {
    return toJSON(this);
  }

  toString() {
    return String(this.toJSON());
  }
}
