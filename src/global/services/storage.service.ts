/* eslint-disable class-methods-use-this */
import { Singleton } from '../../singleton';
import { parseJSON, toJSON } from './mapper.service';

export class StorageService extends Singleton {
  set<T>(name: string, object: T) {
    const item = toJSON(object);
    return localStorage.setItem(name, item);
  }

  get<T>(name: string): T {
    const item = localStorage.getItem(name);
    return parseJSON(item);
  }
}
