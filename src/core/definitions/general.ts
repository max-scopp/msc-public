// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject<A = any> = { [key: number]: A } | { [key: string]: A };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ObjectLike<T = any> = { [key: string]: T };

export type Constructable<T> = { new(): T };

export type StringBoolean = 'true' | 'false';