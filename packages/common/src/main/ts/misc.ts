import { GetLength, ICallable, Prev } from '@qiwi/substrate'
import util from 'util'

import { SyncGuard, TSyncDirective } from './ifaces'

export type BoolOrEmpty = boolean | undefined

export const isPromiseLike = (value: any): boolean =>
  typeof (value as any)?.then === 'function'

export const execute = <C extends ICallable[]>(
  ...callbacks: C
): ReturnType<C[Prev<GetLength<C>>]> =>
  callbacks.reduce((prev, cb) => effect(prev, cb)) as ReturnType<
    C[Prev<GetLength<C>>]
  >

export const exec = <C extends ICallable[]>(
  // sync: S,
  ...callbacks: C
): ReturnType<C[Prev<GetLength<C>>]> =>
  callbacks.reduce((prev, cb) => effect(prev, cb), {} as any) // as SyncGuard<ReturnType<C[Prev<GetLength<C>>]>, S>

export const effect = <V extends any, C extends ICallable>(
  value: V,
  cb: C,
): ReturnType<C> =>
  isPromiseLike(value) ? (value as any)?.then(cb) : cb(value)

export const format = <S extends TSyncDirective, V>(
  sync: S,
  value: V,
): SyncGuard<V, S> =>
  (sync === true
    ? value
    : isPromiseLike(value)
    ? value
    : Promise.resolve(value)) as SyncGuard<V, S>

export const extractValue = (value: any): any =>
  isPromiseLike(value)
    ? // For example: "Promise { 'foo' }"
      util.inspect(value).slice(11, -3)
    : value

// export const a: SyncGuard<string, false> = Promise.resolve('a')
