import { Extends, ICallable, Prev, GetLength } from '@qiwi/substrate'
import util from 'util'
import { ISyncSensitive } from './git'

export type SyncGuard<V, S extends (boolean | undefined)> = Extends<S, true, Extends<V, Promise<any>, never, V>, Extends<V, Promise<any>, V, Promise<V>>>

export type TSupPromise<S extends ISyncSensitive, V> = Extends<
  S,
  { sync: true },
  Extends<V, Promise<any>, never, V>,
  Extends<V, Promise<any>, V, Promise<V>>
>

export const isPromiseLike = (value: any): boolean =>
  typeof (value as any)?.then === 'function'

export const execute = <C extends ICallable[]>(
  ...callbacks: C
): ReturnType<C[Prev<GetLength<C>>]> =>
  callbacks.reduce((prev, cb) => effect(prev, cb)) as ReturnType<
    C[Prev<GetLength<C>>]
  >

export const exec = <S extends (boolean|undefined), C extends ICallable[]>(
  sync: S,
  ...callbacks: C
): SyncGuard<ReturnType<C[Prev<GetLength<C>>]>, S> =>
  format(
    sync,
    execute(...callbacks),
  )

export const effect = <
  V extends any,
  C extends ICallable,
  R1 = Extends<Promise<ReturnType<C>>, Promise<any>, ReturnType<C>, Promise<ReturnType<C>>>,
  R2 = ReturnType<C>
>(
  value: V,
  cb: C,
): Extends<V, Promise<any>, R1, R2> =>
  isPromiseLike(value) ? (value as any)?.then(cb) : cb(value)

export const format = <S extends (boolean|undefined), V extends any>(
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
    // For example: "Promise { 'foo' }"
    ? util.inspect(value).slice(11, -3)
    : value


// export const a: SyncGuard<string, false> = Promise.resolve('a')
