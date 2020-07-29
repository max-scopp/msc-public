/* eslint-disable */
// provide global classes to global scope (window)
export * from './global/expose-global';
// allow explicit import in parent projects wher you may not use
// global scopes (no window)
export * from './global';

// The component you'd like to use
export * from './components';
// The presentationals that SHOULD be compatible with angular and react.
// SHOULD! Likely helpers are missing for react/angular specific
export * from './presentationals';

export * from './singleton';

// additional interfaces, types, etc.
export * from './global/services/api/array-model';
export * from './global/services/api/model';
export * from './global/services/api/model.interface';
