import { AnyComponent, ObjectLike } from '../../definitions';

export function renderIf(criteria) {
  return (children) => (criteria ? children : []);
}

export function renderIfNot(criteria) {
  return (children) => (!criteria ? children : []);
}

export function renderIfOrElse(criteria) {
  return (ifTrueChildren) => (ifFalseChildren) => (criteria ? ifTrueChildren : ifFalseChildren);
}

export function renderSwitch(type, _default?: AnyComponent) {
  return (cases: ObjectLike<AnyComponent>) => (cases[type] ? cases[type] : _default || []);
}
