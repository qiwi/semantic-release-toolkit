import { Extends, ICallable } from '@qiwi/substrate'
import util from 'util'

type GetLength<original extends any[]> = original extends { length: infer L }
  ? L
  : never

export const isPromiseLike = (value: any): boolean =>
  typeof (value as any)?.then === 'function'

export const execute = <C extends ICallable[]>(
  ...callbacks: C
): ReturnType<C[GetLength<C>]> =>
  callbacks.reduce((prev, cb) => effect(prev, cb), {}) as ReturnType<
    C[GetLength<C>]
  >

export const effect = <
  V extends any,
  C extends ICallable,
  R1 = Promise<ReturnType<C>>,
  R2 = ReturnType<C>
>(
  value: V,
  cb: C,
): Extends<V, Promise<any>, R1, R2> =>
  isPromiseLike(value) ? (value as any)?.then(cb) : cb(value)

export const extractValue = (value: any): any => {
  if (isPromiseLike(value)) {
    // For example: "Promise { 'foo' }"
    return util.inspect(value).slice(11, -3)
  }

  return value
}
