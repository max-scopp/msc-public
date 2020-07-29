
export type TypeOfValues = 'object' | 'boolean' | 'function' | 'number' | 'string' | 'undefined';

export interface IModel {
  /**
   * To literal object type
   * Array or Object, depending what implementation
   */
  toObject<R>(): R;

  /**
   * Uses RemapperService.toJson, which handles dependency circles.
   */
  toJSON(): string;

  /**
   * Give you the model as string, using toJSON, duh.
   */
  toString(): string;
}
